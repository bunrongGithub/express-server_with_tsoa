import app from "@/src/app";
import configs from "@/src/config";
import connection from "@/src/database/connection";


console.log(process.env.TZ)
async function run() {
    try {
        await connection().then(() => {
            app.listen(configs.port, () => {
                console.log(`User Service running on Port: ${configs.port}`);
            })
        })
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
run();