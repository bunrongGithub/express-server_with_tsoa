import app from "./app";
import configs from "./config";
import connection from "./database/connection";

async function run() {
    try {
        await connection().then(() => {
            app.listen(configs.port, () => {
               // console.log('hello world')
                console.log(`User Service running on Port: ${configs.port}`);
            })
        })
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
run();