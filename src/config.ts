import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
    env: string;
    port: number;
    mongodbUrl: string;
    cognitoRegion: string;
    cognitoClientId: string;
    cognitoClientSecret:string;
    cognitoRedirectURL:string;
    awsCognitoDomain: string;
}
// Function to load and validate environment variables
function loadConfig(): Config {
    // Determine the environment and set the appropriate .env file
    const env = process.env.NODE_ENV || 'development';
    const envPath = path.resolve(__dirname,`./configs/.env.${env}`);
    dotenv.config({path: envPath});
    // Define a schema for the environment variables
    const envVarsSchema = Joi.object({
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number().default(3000),
        MONGODB_URL: Joi.string().required(),
        COGNITO_REGION: Joi.string().required(),
        COGNITO_CLIENT_ID: Joi.string().required(),
        COGNITO_CLIENT_SECRET: Joi.string().required(),
        COGNITO_REDIRECT_URL: Joi.string().required(),
        AWS_COGNITO_DOMAIN: Joi.string().required(),
    }).unknown().required();
    // Validate the environment variables
    const {value: envVars,error} = envVarsSchema.validate(process.env);
    
    if(error){
        throw new Error(`Config validation error: ${error.message}`);
    }
    return{
        env: envVars.NODE_ENV,
        port: envVars.PORT,
        mongodbUrl: envVars.MONGODB_URL,
        cognitoClientId: envVars.COGNITO_CLIENT_ID,
        cognitoRegion: envVars.COGNITO_REGION,
        cognitoClientSecret: envVars.COGNITO_CLIENT_SECRET,
        cognitoRedirectURL: envVars.COGNITO_REDIRECT_URL,
        awsCognitoDomain: envVars.AWS_COGNITO_DOMAIN
    }
}
const configs = loadConfig();
export default configs;