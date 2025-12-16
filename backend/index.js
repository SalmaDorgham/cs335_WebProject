const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/usersRoutes");
const productRoutes = require("./routes/productsRoutes");

app.get("/", (req, res) => res.json({ ok: true, name: "Swapify API" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

mongoose.connect("mongodb+srv://sadeldorgham_db_user:R6Gdq1ORsgWJjgix@cluster0.nfltrt2.mongodb.net/?appName=Cluster0")

app.listen(5000, () => console.log("Server is running"));