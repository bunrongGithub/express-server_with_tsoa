export interface SignUpRequest{
    phone: string;
    password: string;
    email: string;
}
export interface SignInRequest{
    password: string;
    email: string;
}
export interface SigInResponse{
    email: string;
    accessToken: string;
    refreshToken: string;
    idToken: string;
}
export interface ConfirmSignUpRequest{
    email: string;
    confirmationCode: string;
}
