const Queue = require("bull");
const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1", // Default to localhost if not provided
  port: process.env.REDIS_PORT || 6379, // Default to port 6379 if not provided
  password: process.env.REDIS_PASSWORD || "Unhackable56_", // Optional, only used if provided
};

const ExamSubmissionQueue = new Queue("exam_submission", {
  redis: redisConfig,
});

// Log connection status
ExamSubmissionQueue.on("ready", () => {
  console.log("Redis connection established. Queue is ready.");
});

ExamSubmissionQueue.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

ExamSubmissionQueue.on("failed", (job, error) => {
  console.error(`Job ${job.id} failed with error:`, error.message);
});

ExamSubmissionQueue.on("stalled", (job) => {
  console.warn(`Job ${job.id} stalled and will be retried.`);
});

ExamSubmissionQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed successfully.`);
});

// Add event listener for logging job progress
ExamSubmissionQueue.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% complete.`);
});

module.exports = ExamSubmissionQueue;
