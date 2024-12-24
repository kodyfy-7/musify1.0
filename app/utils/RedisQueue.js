const Queue = require('bull');

// Configure Redis connection
const redisConfig = { host: '127.0.0.1', port: 6379 };

// Create a queue
const ExamSubmissionQueue = new Queue('exam_submission', { redis: redisConfig });

// Event handlers for logging
ExamSubmissionQueue.on('waiting', (jobId) => {
  console.log(`Job with ID ${jobId} is waiting to be processed.`);
});

ExamSubmissionQueue.on('active', (job) => {
  console.log(`Job with ID ${job.id} is now active. Data:`, job.data);
});

ExamSubmissionQueue.on('completed', (job, result) => {
  console.log(`Job with ID ${job.id} has been completed. Result:`, result);
});

ExamSubmissionQueue.on('failed', (job, err) => {
  console.error(`Job with ID ${job.id} failed. Error:`, err);
});

ExamSubmissionQueue.on('stalled', (job) => {
  console.warn(`Job with ID ${job.id} has stalled and will be retried.`);
});

// Export the queue
module.exports = ExamSubmissionQueue;
