module.exports = {
    apps: [
      {
        name: "exam-submission-worker",
        script: "./app/utils/workers/ExamSubmissionWorker.js",
        instances: 1,
        autorestart: true,
        watch: false,
      },
    ],
  };
  