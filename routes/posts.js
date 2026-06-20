import express from "express";
import posts from "../data/posts.js";
import comments from "../data/comments.js";
import error from "../utilities/error.js";

const router = express.Router();

// GET all posts (HATEOAS)
router.get("/", (req, res) => {
  const { userId } = req.query;

  let result = posts;

  if (userId) result = posts.filter(p => p.userId == userId);

  res.json({
    posts: result,
    links: [
      { rel: "create-post", href: "/api/posts", type: "POST" }
    ]
  });
});

// POST post
router.post("/", (req, res, next) => {
  const { userId, title, content } = req.body;

  if (!userId || !title || !content)
    return next(error(400, "Missing data"));

  const post = {
    id: posts[posts.length - 1].id + 1,
    userId,
    title,
    content
  };

  posts.push(post);
  res.status(201).json(post);
});

// GET post by id (HATEOAS)
router.get("/:id", (req, res, next) => {
  const post = posts.find(p => p.id == req.params.id);

  if (!post) return next(error(404, "Post not found"));

  res.json({
    post,
    links: [
      { rel: "all-posts", href: "/api/posts", type: "GET" },
      { rel: "comments", href: `/api/posts/${post.id}/comments`, type: "GET" }
    ]
  });
});

// POST COMMENTS FOR POST
router.get("/:id/comments", (req, res) => {
  res.json({
    comments: comments.filter(c => c.postId == req.params.id),
    links: [
      { rel: "post", href: `/api/posts/${req.params.id}`, type: "GET" }
    ]
  });
});

export default router;