import express, { json } from "express";
import { config } from "dotenv";
config();
import userRoutes from "./src/modules/user/user.routes.js";
import categoryRoutes from "./src/modules/category/category.routes.js";
import taskRoutes from "./src/modules/task/task.routes.js";
import connectDB from "./database/dbConnection.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(json());

app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
