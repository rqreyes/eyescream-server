import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Low, JSONFile } from "lowdb";
import { flavorsRouter } from "./routes/flavors.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
const PORT = process.env.PORT || 4000;

// initialize database
const adapter = new JSONFile("db.json");
const db = new Low(adapter);

// add default data
await db.read();
db.data ||= { flavors: [] };
await db.write();
app.db = db;

// set up API documentation
const swaggerDocument = YAML.load("./spec/openapi.yaml");

// set up middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/flavors", flavorsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
