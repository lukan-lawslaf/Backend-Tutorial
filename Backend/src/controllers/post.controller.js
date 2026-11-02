import { Post } from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const { name, description, age } = req.body ?? {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof age !== "number"
    ) {
      return res.status(400).json({
        message: "Provide a name, description, and numeric age",
      });
    }

    const post = await Post.create({ name, description, age });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Post details do not meet the model's requirements",
      });
    }

    return res.status(500).json({ message: "Could not create post" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch posts" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, age } = req.body ?? {};

    if (name === undefined && description === undefined && age === undefined) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (age !== undefined) updates.age = age;

    const post = await Post.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    if (error.name === "CastError" || error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid ID or post details" });
    }

    return res.status(500).json({ message: "Could not update post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      post,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    return res.status(500).json({
      message: "Could not delete post",
    });
  }
};