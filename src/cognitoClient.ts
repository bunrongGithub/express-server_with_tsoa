import configs from "./config";
import {
  CognitoIdentityProvider,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  GetUserCommand,
  GetUserCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  SignUpCommand,
  SignUpCommandInput,
  SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";

// Create a Cognito Client instance
export const cognitoClient = new CognitoIdentityProvider({
  region: configs.cognitoRegion,
});

// Cognito Client Handler Class
export class CognitoClientHandlers {
  private cognitoClientRegion: CognitoIdentityProvider;

  // Constructor to initialize the Cognito client with the provided region
  constructor(cognitoClientRegion: any) {
    this.cognitoClientRegion = new CognitoIdentityProvider({
      region: cognitoClientRegion,
    });
  }

  // Sign up method for AWS Cognito using V2 SDK
  public async signUpV2(params: SignUpCommandInput): Promise<SignUpCommandOutput> {
    try {
      // Create a SignUp command using the provided parameters
      const command = new SignUpCommand(params);

      // Send the command using the Cognito client
      const response = await this.cognitoClientRegion.send(command);

      // Log the response (optional)
      console.log("User signed up successfully:", response);

      // Return the response for further use
      return response;
    } catch (error) {
      console.error("Error signing up the user:", error);
      throw new Error(`Sign up failed: ${error}`);
    }
  }
  public async confirmSignUpV2(params: ConfirmSignUpCommandInput) {
    try {
      const command = new ConfirmSignUpCommand(params);
      const response = await this.cognitoClientRegion.send(command);
      // console.log("User confirm signUp successfully: ", response);
      return response;
    } catch (error) {
      console.error("Error confirm signup:", error);
      throw new Error(`Confirm Sign up failed: ${error}`);
    }
  }
  public async signInV2(params: InitiateAuthCommandInput) {
    try {
      const command = new InitiateAuthCommand(params);
      const response = await this.cognitoClientRegion.send(command);

      return response;
    } catch (error) {
      console.error("Error confirm signup:", error);
      throw new Error(`Sign in failed: ${error}`);
    }
  }
  public async getUserData(params: GetUserCommandInput){
    try {
      const command = new GetUserCommand(params);
      return await this.cognitoClientRegion.send(command);
    } catch (error) {
      
    }
  }
}

