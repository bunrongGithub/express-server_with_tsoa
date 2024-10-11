
import { IUserAuthSignUpRequest } from "./types/auth-repositoies.type";
import authModel, { IAuth } from "../models/auth.model";
export class AuthRepositories {
    //=================================================================
    // method for insert user into mongo database if user verifyed
    //=================================================================
    public async registerUserIsSignIn(params: IUserAuthSignUpRequest): Promise<IAuth> {
        try {
            const createUser = await authModel.create(params);
            return createUser;
        } catch (error) {
            throw error;
        }
    }
    public async findUserByEmail(email: string | undefined): Promise<IAuth | null> {
        if (!email) return null;
        try {
            // Query the database for a user with the given email
            const existingUser = await authModel.findOne({ email });
            return existingUser;
        } catch (error) {
            console.error('Error finding user by email:', error);
            return null;
        }
    }
}