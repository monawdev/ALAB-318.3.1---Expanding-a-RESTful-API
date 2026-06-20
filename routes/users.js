import express from "express";
import users from "../data/users.js";
import posts from "../data/posts.js";
import comments from "../data/comments.js";
import error from "../utilities/error.js";

const router = express.Router();

// GET all users (HATEOAS)
router.get("/", (req, res) => {
  const result = users.map(u => ({
    ...u,
    links: [
      { rel: "self", href: `/api/users/${u.id}`, type: "GET`" },
      { rel: "posts", href: `/api/users/${u.id}/posts`, type: "GET`" },
      { rel: "comments", href: `/api/users/${u.id}/comments`, type: "GET`" }
    ]
  }));

  res.json({
    users: result,
    links: [
      { rel: "create-user", href: "/api/users", type: "POST" }
    ]
  });
});

// POST user
router.post("/", (req, res, next) => {
  const { name, username, email } = req.body;

  if (!name || !username || !email)
    return next(error(400, "Missing data"));

  const user = {
    id: users[users.length - 1].id + 1,
    name,
    username,
    email
  };

  users.push(user);
  res.status(201).json(user);
});

// GET user by id (HATEOAS)
router.get("/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) return next(error(404, "User not found"));

  res.json({
    user,
    links: [
      { rel: "all-users", href: "/api/users", type: "GET" },
      { rel: "posts", href: `/api/users/${user.id}/posts`, type: "GET" },
      { rel: "comments", href: `/api/users/${user.id}/comments`, type: "GET" }
    ]
  });
});

// USER POSTS
router.get("/:id/posts", (req, res) => {
  res.json({
    posts: posts.filter(p => p.userId == req.params.id),
    links: [
      { rel: "user", href: `/api/users/${req.params.id}`, type: "GET" }
    ]
  });
});

// USER COMMENTS
router.get("/:id/comments", (req, res) => {
  res.json({
    comments: comments.filter(c => c.userId == req.params.id),
    links: [
      { rel: "user", href: `/api/users/${req.params.id}`, type: "GET" }
    ]
  });
});

export default router;