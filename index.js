import express from "express";

import users from "./routes/users.js";
import posts from "./routes/posts.js";
import comments from "./routes/comments.js";

import error from "./utilities/error.js";

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// SAFE Logging Middleware

app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----\n${time.toLocaleTimeString()}: ${req.method} ${req.url}`
  );

  if (req.body && typeof req.body === "object") {
    if (Object.keys(req.body).length > 0) {
      console.log(req.body);
    }
  }

  next();
});

// Routes

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/comments", comments);


// Home Route

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});


// 404 Handler

app.use((req, res, next) => {
  next(error(404, "Route not found"));
});


// Global Error Handler

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});


// Start Server

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});