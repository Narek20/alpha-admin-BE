import express from "express";
import cors from "cors";
import env from "./src/env/env.variables";
import { Router } from "./src/routes/router";
import { databaseConnection } from "./src/database/connection";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);

/**
 * Lifecycle of a normal request
 *
 * - Router(s)
 */
app.use(Router.middleware);
databaseConnection()

app.use(express.static("public"));

app.listen(env.port || 8080, () => {
  console.log("Server running on port 8080");
});
