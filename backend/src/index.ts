import express from "express";
import dotenv from "dotenv";
import { initializeDatabase } from "./db/init.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeDatabase()
  .then(() => {
    console.log("Database initialized");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

export default app;
