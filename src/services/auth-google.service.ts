import axios from "axios";
import configs from "../config";
import crypto from "crypto"
export class AuthGoogleSerice {
    private generatedRandomBytes(): string {
        return crypto.randomBytes(16).toString("hex");
    }
    private awsCognitoDomain(endpiont: string = '') {
        return `${configs.awsCognitoDomain}${endpiont}`
    }
    public loginWithGoogle(state: string): string {
        const stateValue = state || this.generatedRandomBytes();
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: configs.cognitoClientId,
            redirect_uri: configs.cognitoRedirectURL,
            identity_provider: 'Google',
            scope: 'openid profile email',
            state: stateValue,
            prompt: 'select_account',
        })
        console.log(params);
        return this.awsCognitoDomain(`/oauth2/authorize?${params.toString()}`)
        // return `${configs.awsCognitoDomain}/oauth2/authorize?${params.toString()}`;
    }
    public async handleCallback(code: string, _state: string): Promise<any> {
        const tokenUrl = this.awsCognitoDomain(`/oauth2/token`);
        // const tokenUrl = `${configs.awsCognitoDomain}/oauth2/token`;
        // console.log("code :", code)
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: configs.cognitoClientId,
            redirect_uri: configs.cognitoRedirectURL,
            code: code,
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${configs.cognitoClientId}:${configs.cognitoClientSecret}`).toString('base64')}`,
        };

        try {
            const response = await axios.post(tokenUrl, params.toString(), { headers });
            return response.data; // This will contain access token, id token, etc.
        } catch (error) {
            console.error('Failed to get tokens from Cognito', error);
            throw new Error('Failed to get tokens from Cognito');
        }
    }
    public async getAccessUserProfile(accessToken: string): Promise<any> {
        try {
            const response = await axios.get(configs.cognitoRedirectURL, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
