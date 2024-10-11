import { Body, Controller, Post, Route } from "tsoa";
import { AuthService } from "../services/auth.service";
import { SignInRequest, SignUpRequest, ConfirmSignUpRequest } from "./types/auth-request.type";
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
    public async signInV2(@Body() requestBody: SignInRequest){
        try {
            const response = await this.authService.signInV2(requestBody.email,requestBody.password);
            return response;
        } catch (error: any) {
            this.setStatus(401);
            return {message: error.message};
        }
    }
}