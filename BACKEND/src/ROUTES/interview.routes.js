const express = require("express");
const { analyzeResume, GenerateQuestion, submitAnswer, finishInterview, getAllInterviewHistory, getInterviewReport } = require("../CONTROLLER/interview.controller");
const upload = require("../MIDDLEWARE/multer");
const { isAuth } = require("../MIDDLEWARE/isAuth");

const interviewRouter = express.Router();

interviewRouter.post("/analyze-resume", isAuth, upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-question", isAuth, GenerateQuestion);
interviewRouter.post("/submit-answer", isAuth, submitAnswer);
interviewRouter.post("/finish-interview", isAuth, finishInterview);
interviewRouter.get("/history", isAuth, getAllInterviewHistory);
interviewRouter.get("/report/:interviewId", isAuth, getInterviewReport);

module.exports = interviewRouter;