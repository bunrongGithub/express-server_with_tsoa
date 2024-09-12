import express ,{Express} from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/v1/routes";
import fs from "fs";
import path from "path";

const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, "docs/swagger.json"), 'utf8'));
// ==================
// Initialize App Express
// ==================
const app: Express = express();
// ========================
// Global Middleware
// ========================
app.use(express.json());

// ========================
// Global API V1
// ========================
RegisterRoutes(app);

// ========================
// API Documentations
// ========================
app.use("/api/docs", swaggerUi.serve , swaggerUi.setup(swaggerDocument));
export default app;