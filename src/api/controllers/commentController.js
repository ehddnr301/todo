import Todo from "../../models/Todo";
import Comment from "../../models/Comment";
import { validationFailed } from "../../utils";

const getTodoId = base => base.split("/")[2];

export const createComment = async (req, res) => {
  const {
    baseUrl,
    body: { contents }
  } = req;

  const todoId = getTodoId(baseUrl);

  try {
    const todo = await Todo.findById(todoId);
    const newComment = await Comment.create({
      contents
    });
    todo.comments.push(newComment.id);
    todo.save();
    res
      .status(200)
      .json(newComment)
      .end();
  } catch (error) {
    validationFailed(error, res);
  }
};

export const getComments = async (req, res) => {
  const { baseUrl } = req;

  const todoId = getTodoId(baseUrl);

  try {
    const todo = await Todo.findById(todoId).populate("comments");
    const comments = todo.comments;
    res
      .status(200)
      .json(comments)
      .end();
  } catch (error) {
    validationFailed(error, res);
  }
};

export const getComment = async (req, res) => {
  const {
    baseUrl,
    params: { commentId }
  } = req;

  const todoId = getTodoId(baseUrl);

  try {
    const todo = await Todo.findById(todoId).populate("comments");
    const comments = todo.comments;
    const comment = comments.filter(c => c._id == commentId);
    res
      .status(200)
      .json(...comment)
      .end();
  } catch (error) {
    validationFailed(error, res);
  }
};

export const updateComment = async (req, res) => {
  const {
    params: { commentId },
    body: { contents }
  } = req;

  try {
    const updateComment = await Comment.findOneAndUpdate(
      {
        _id: commentId
      },
      { contents },
      { new: true }
    );
    res
      .status(200)
      .json(updateComment)
      .end();
  } catch (error) {
    validationFailed(error, res);
  }
};

export const removeComment = async (req, res) => {
  const {
    params: { commentId }
  } = req;

  try {
    await Comment.findOneAndRemove({ _id: commentId });
    res
      .status(200)
      .json({ msg: "success" })
      .end();
  } catch (error) {
    validationFailed(error, res);
  }
};
