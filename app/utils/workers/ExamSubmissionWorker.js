const ExamSubmissionQueue = require("../queues/ExamSubmissionQueue");
const { Op, Sequelize } = require("sequelize");

const sequelize = require("../../../database/PostgresDb");
const {
  gradeCandidateAnswers,
  handleCandidateMultiChoice,
  handleCandidateEthicalBased,
  handleCandidateLikertScale,
  collateCandidateResults,
  deductCandidate,
} = require("../../services/ExamSubmissionService");
const UserExam = require("../../../models/UserExam");
const UserExamResult = require("../../../models/UserExamResult");
const QuestionSpool = require("../../../models/QuestionSpool");
const Exam = require("../../../models/Exam");
const Question = require("../../../models/Question");
const Answer = require("../../../models/Answer");
const Section = require("../../../models/Section");

ExamSubmissionQueue.process(async (job, done) => {
  const { 
    userId,
    examId,
    userExamId,
    clientId,
    scoreStyle,
    scoreValue,
    totalCategoryPrice,
    groupedQuestions,
    result,
    userExam
  } = job.data;

  console.log(`Processing job for User: ${userId}, Exam: ${examId}`);

  const transaction = await sequelize.transaction();
  try {
    const modifiedQuestions = await gradeCandidateAnswers(groupedQuestions, transaction);

    const handlers = {
      "multi-choice": handleCandidateMultiChoice,
      "ethical-based": handleCandidateEthicalBased,
      "likert-scale": handleCandidateLikertScale,
    };

    for (const [type, questions] of Object.entries(modifiedQuestions)) {
      if (questions.length > 0 && handlers[type]) {
        await handlers[type](questions, scoreStyle, scoreValue, result, transaction);
      }
    }

    await collateCandidateResults(result, transaction);
    await deductCandidate(
      userId,
      examId,
      userExamId,
      clientId,
      totalCategoryPrice,
      transaction
    );

    // Commit transaction
    await transaction.commit();

    console.log(`Job processed successfully for User: ${userId}, Exam: ${examId}`);
    done();
  } catch (error) {
    await transaction.rollback();
    console.error("Error processing job:", error);
    done(error);
  }
});
