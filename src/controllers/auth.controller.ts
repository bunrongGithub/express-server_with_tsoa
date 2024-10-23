import { Body, Controller, Post, Request, Route } from "tsoa";
import { AuthService } from "../services/auth.service";
import { SignInRequest, SignUpRequest, ConfirmSignUpRequest, SigInResponse } from "./types/auth-request.type";
import { setCookies } from "../utils/cookies";
import express from "express"
@Route("/v1/auth")
export class AuthController extends Controller {
    private authService: AuthService;
    constructor() {
        super();
        this.authService = new AuthService();
    }
    @Post("/sigupv2")
    public async signUpV2(@Body() requestBody: SignUpRequest) {
        try {
            const result = await this.authService.signUpV2(requestBody.email, requestBody.phone, requestBody.password);
            return result;
        } catch (error) {
            throw error;
        }
    }
    @Post("/confirm")
    public async confirmSignUpV2(@Body() requestBody: ConfirmSignUpRequest) {
        try {
            const response = await this.authService.confirmSignUpV2(requestBody.email, requestBody.confirmationCode);
            return response;
        } catch (error: any) {
            this.setStatus(401);
            return { message: error.message };
        }
    }
    @Post("/signinv2")
    public async signInV2(@Body() requestBody: SignInRequest,@Request() req:express.Request): Promise<SigInResponse> {
        try {
            const response = await this.authService.signInV2(requestBody.email, requestBody.password);
            const accessToken = response?.accessToken;
            const refreshToken = response?.accessToken;
            const idToken = response?.idToken;
            const res = (req as any).res as express.Response
            //Set accessToken ,refreshToken,idToken to cookie
            setCookies(res,'access_token',accessToken!);
            setCookies(res,'idToken',idToken!);
            setCookies(res,'refreshToken',refreshToken!)
            return response!;
        } catch (error: unknown) {
            this.setStatus(401);
            throw new Error(error as any);
        }
    }
}