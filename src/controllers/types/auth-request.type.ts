export interface SignUpRequest{
    phone: string;
    password: string;
    email: string;
}
export interface SignInRequest{
    password: string;
    email: string;
}
export interface ConfirmSignUpRequest{
    email: string;
    confirmationCode: string;
}
