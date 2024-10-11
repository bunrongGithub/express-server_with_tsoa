import configs from "../config";
import { CognitoClientHandlers } from "../cognitoClient"
import { AuthRepositories } from "../database/repositories/auth.repositories";
import { ConfirmSignUpCommandInput, GetUserCommandInput, GetUserCommandOutput, InitiateAuthCommandInput, SignUpCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { IAuth } from "../database/models/auth.model";
import { IUserAuthSignUpRequest } from "../database/repositories/types/auth-repositoies.type";

export class AuthService {
    private authRepository: AuthRepositories;
    private cognitoHandler: CognitoClientHandlers;
    constructor() {
        this.cognitoHandler = new CognitoClientHandlers(configs.cognitoRegion)
        this.authRepository = new AuthRepositories();
    }
    private calculateSecretHash(username: string): string {
        return createHmac("sha256", configs.cognitoClientSecret!)
            .update(username + configs.cognitoClientId)
            .digest("base64");
    }
    private async getUserData(accessToken: string | undefined): Promise<GetUserCommandOutput | undefined> {
        try {
            const params: GetUserCommandInput = {
                AccessToken: accessToken
            }
            const userDataResponse = await this.cognitoHandler.getUserData(params);
            return userDataResponse;
        } catch (error) {
            throw error;
        }
    }
    public async signUpV2(email: string, phone: string, password: string) {
        console.log("PHone number: ", phone);

        try {
            const sigUpParams: SignUpCommandInput = {
                ClientId: configs.cognitoClientId!,
                Username: email || phone, // user can signup with phone or email
                Password: password,
                SecretHash: this.calculateSecretHash(email!),
            }
            // 3. Sign up the user to AWS Cognito
            const cognitoResponse = await this.cognitoHandler.signUpV2(sigUpParams);
            console.log("cognito response: ", cognitoResponse);

            return cognitoResponse;
        } catch (error) {
            throw error;
        }
    }
    public async confirmSignUpV2(email: string, confirmationCode: string, phone?: string) {
        try {
            const params: ConfirmSignUpCommandInput = {
                ClientId: configs.cognitoClientId,
                Username: email || phone,
                ConfirmationCode: confirmationCode,
                SecretHash: this.calculateSecretHash(email), // Include SecretHash
            }
            const cognitoResponse = await this.cognitoHandler.confirmSignUpV2(params);
            return cognitoResponse;
        } catch (error) {
            console.log("Error during confirm code: ", error);
            throw error;
        }
    }
    // Sign-In Method with Existence Check
    public async signInV2(email: string, password: string): Promise<IAuth | null> {
        try {
            // Step 1: Initiate Authentication with Cognito
            const params: InitiateAuthCommandInput = {
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: configs.cognitoClientId,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                    SECRET_HASH: this.calculateSecretHash(email),
                }
            };

            const cognitoResponse = await this.cognitoHandler.signInV2(params);
            const accessToken = cognitoResponse.AuthenticationResult?.AccessToken;

            // Step 2: Get user data from Cognito using the AccessToken
            const userdata = await this.getUserData(accessToken);
            const userAtt = userdata?.UserAttributes || [];

            // Step 3: Map Cognito attributes to IAuth structure
            const authData: Partial<IAuth> = {};
            for (const user of userAtt) {
                const { Name, Value } = user;
                switch (Name) {
                    case 'email':
                        authData.email = Value;
                        break;
                    case 'email_verified':
                        authData.email_verified = Value;
                        break;
                    default:
                        break;
                }
            }

            // Step 4: Check if the user already exists in the database by email
            const existingUser = await this.authRepository.findUserByEmail(authData.email);

            // If user exists, return the existing user data
            if (existingUser) {
                console.log('User already exists, returning existing user data.');
                return existingUser;
            }

            // If user does not exist, create a new user in the database
            if (authData.email && authData.email_verified) {
                const newUser = await this.authRepository.registerUserIsSignIn(authData as IUserAuthSignUpRequest);
                console.log('New user registered successfully:', newUser);
                return newUser;
            }

            console.error('Missing required fields in authData:', authData);
            return null;
        } catch (error) {
            console.error('Error during sign-in process:', error);
            throw error;
        }
    }
}