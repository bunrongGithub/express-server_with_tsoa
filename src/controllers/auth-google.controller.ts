import { Controller, Get, Query, Route } from "tsoa";
import { AuthGoogleSerice } from "../services/auth-google.service";
import { sendResponse } from "../utils/sendRespone";



@Route("/v1/auth")
export class AuthGoogleController extends Controller {
    private googleAuthService: AuthGoogleSerice;
    constructor() {
        super();
        this.googleAuthService = new AuthGoogleSerice();
    }
    /**
  * Login with Google using Cognito OAuth2
  * @param state A unique state string to prevent CSRF attacks
  */
    @Get('/google/login')
    public loginWithGoogle(@Query() state: string) {
        const cognitoOAuthURL = this.googleAuthService.loginWithGoogle(state);
        return sendResponse({ message: 'Login with Google successfully', data: cognitoOAuthURL });
    }
    @Get('/callback')
    public async cognitoCallback(@Query() code: string, @Query() state: string) {
        try {
            // Exchange the code for tokens
            const tokens = await this.googleAuthService.handleCallback(code, state);
            // console.log('AuthController - cognitoCallback() Log : ', tokens);
            console.log('Authorization code received:', code);
            console.log('State received:', state);
            return sendResponse({
                message: 'Authentication successful',
                data: tokens,
            });
        } catch (error) {
            console.error(error);
            return sendResponse({
                message: 'Authentication failed',
                status: 500,
            });
        }
    }
}

