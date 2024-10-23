import configs from "../config";
import { CognitoClientHandlers } from "../cognitoClient"
// import { AuthRepositories } from "../database/repositories/auth.repositories";
import { ConfirmSignUpCommandInput, GetUserCommandInput, GetUserCommandOutput, InitiateAuthCommandInput, SignUpCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { SigInResponse } from "../controllers/types/auth-request.type";

export class AuthService {
    //private authRepository: AuthRepositories;
    private cognitoHandler: CognitoClientHandlers;
    constructor() {
        this.cognitoHandler = new CognitoClientHandlers(configs.cognitoRegion)
        // this.authRepository = new AuthRepositories();
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
    public async signInV2(emailRequest: string, password: string): Promise<SigInResponse | undefined> {
        try {
            // Step 1: Initiate Authentication with Cognito
            const params: InitiateAuthCommandInput = {
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: configs.cognitoClientId,
                AuthParameters: {
                    USERNAME: emailRequest,
                    PASSWORD: password,
                    SECRET_HASH: this.calculateSecretHash(emailRequest),
                }
            };

            const cognitoResponse = await this.cognitoHandler.signInV2(params);
            const accessToken = cognitoResponse.AuthenticationResult?.AccessToken;
            const tokenId = cognitoResponse.AuthenticationResult?.IdToken;
            const refreshToken = cognitoResponse.AuthenticationResult?.RefreshToken;

            // Step 2: Get user data from Cognito using the AccessToken
            const userdata = await this.getUserData(accessToken);
            // console.log("User Data: ", userdata);
            const userAtt = userdata?.UserAttributes || [];
            const result = userAtt.reduce((acc, { Name, Value }) => {
                if (Name && Value !== undefined) {
                    acc[Name] = Value;
                }
                return acc;
            }, {} as Record<string, string>);
            const {email} = result;
            return {
                accessToken: accessToken!,
                idToken: tokenId!,
                refreshToken: refreshToken!,
                email: email,
            };
        } catch (error) {
            console.error('Error during sign-in process:', error);
            throw error;
        }
    }
}