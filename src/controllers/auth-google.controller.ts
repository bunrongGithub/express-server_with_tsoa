import { Controller, Get, Query, Request, Route } from "tsoa";
import { AuthGoogleSerice } from "../services/auth-google.service";
import { sendResponse } from "../utils/sendRespone";
import { setCookies } from "../utils/cookies";
import { Response } from "express";
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
    public async cognitoCallback(@Request() request: Express.Request,@Query() code: string, @Query() state: string) {
        try {
            // Exchange the code for tokens
            const response = (request as any).res as Response
            const tokens = await this.googleAuthService.handleCallback(code, state);
            setCookies(response ,'id_token',tokens.id_token);
            setCookies(response, 'access_token', tokens.access_token);
            setCookies(response, 'refresh_token', tokens.refresh_token, { maxAge: 30 * 24 * 3600 * 1000 });
            setCookies(response, 'username', tokens.username!, { maxAge: 30 * 24 * 3600 * 1000 });
            setCookies(response, 'user_id', tokens.userId!, { maxAge: 30 * 24 * 3600 * 1000 });

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
    @Get("/profile")
    public async getAccessUserProfile(@Query() accessToken: string) {
        try {
            const profile = await this.googleAuthService.getAccessUserProfile(accessToken);
            return sendResponse({
                message: "user information",
                status: 200,
                data: profile
            })
        } catch (error) {
            throw error;
        }
    }
}

