import express from "express";
import comments from "../data/comments.js";
import error from "../utilities/error.js";

const router = express.Router();

// GET all comments
router.get("/", (req, res) => {
  const { userId, postId } = req.query;

  let result = comments;

  if (userId) result = result.filter(c => c.userId == userId);
  if (postId) result = result.filter(c => c.postId == postId);

  res.json(result);
});

// POST comment
router.post("/", (req, res, next) => {
  const { userId, postId, body } = req.body;

  if (!userId || !postId || !body)
    return next(error(400, "Missing data"));

  const comment = {
    id: comments[comments.length - 1].id + 1,
    userId,
    postId,
    body
  };

  comments.push(comment);
  res.json(comment);
});

// GET comment by id
router.get("/:id", (req, res, next) => {
  const comment = comments.find(c => c.id == req.params.id);
  if (comment) res.json(comment);
  else next();
});

// PATCH comment
router.patch("/:id", (req, res, next) => {
  const comment = comments.find((c, i) => {
    if (c.id == req.params.id) {
      Object.assign(comments[i], req.body);
      return true;
    }
  });

  if (comment) res.json(comment);
  else next();
});

// DELETE comment
router.delete("/:id", (req, res, next) => {
  const comment = comments.find((c, i) => {
    if (c.id == req.params.id) {
      comments.splice(i, 1);
      return true;
    }
  });

  if (comment) res.json(comment);
  else next();
});

export default router;