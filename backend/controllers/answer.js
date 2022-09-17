const Answer = require("../Models/Answer");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createAnswer = async (req, res) => {
  const { userID } = req.user;
  const { answer } = req.body;
  const { id } = req.params;
  if (!answer) {
    throw new CustomError.BadRequestError("Provide an answer.");
  }

  const resAnswer = await Answer.create({ answer, user: userID, comment: id });
  res.status(StatusCodes.CREATED).json({
    answer: resAnswer,
    msg: "Answer created Successfully",
  });
};

const deleteAnswer = async (req, res) => {
  const { userID, role } = req.user;
  const { id } = req.params;

  let answer;
  if (role === "admin") {
    answer = await Answer.findOne({ _id: id });
  } else {
    answer = await Answer.findOne({ _id: id, user: userID });
  }

  if (!answer) {
    throw new CustomError.NotFoundError("Not found!");
  }
  await answer.remove();
  res.status(StatusCodes.OK).json({ answer, msg: "Deleted Successfully" });
};

const updateAnswer = async (req, res) => {
  const { userID } = req.user;
  const { id } = req.params;
  const { updatedAnswer } = req.body;
  if (!updatedAnswer) {
    throw new CustomError.BadRequestError("Provide an answer.");
  }

  const answer = await Answer.findOneAndUpdate(
    { _id: id, user: userID },
    { answer: updatedAnswer },
    { new: true }
  );

  if (!answer) {
    throw new CustomError.NotFoundError("Answer not found");
  }

  res.status(StatusCodes.OK).json({ answer, msg: "Success" });
};
module.exports = {
  createAnswer,
  deleteAnswer,
  updateAnswer,
};
