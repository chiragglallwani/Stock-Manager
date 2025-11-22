import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./db/init.js";
import { ResponseHandler } from "./utils/response.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import warehouseRoutes from "./routes/warehouse.routes.js";
import locationRoutes from "./routes/location.routes.js";
import productLogRoutes from "./routes/productLog.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
    ];

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes (no authentication required)
app.use("/api/auth", authRoutes);

// Protected routes (authentication required)
app.use("/api/products", productRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/product-logs", productLogRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  ResponseHandler.success(res, { status: "ok" }, "Server is running");
});

// 404 handler
app.use((req, res) => {
  ResponseHandler.error(res, "Route not found", 404);
});

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

export default app;
