require("dotenv").config();
const app = require("express")();

const i18n = require('i18n');

// i18n configuration
// i18n.configure({
//   locales: ['en', 'fr', 'pt'], // Define supported languages
//   directory: __dirname + '/languages', // Path to locales directory
//   defaultLocale: 'en', // Fallback language
//   queryParameter: 'lang', // Allow passing lang as a query param
//   autoReload: true,
//   syncFiles: true,
//   header: 'accept-language' // Read language from headers
// });

// // Middleware to initialize i18n
// app.use(i18n.init);

app.disable("etag");

const Cors = require("cors");
const BodyParser = require("body-parser");
const axios = require('axios');
const os = require('os');
const Routes = require("./routes");
const logger = require("./config/logger");

app.use(Cors());
app.use(BodyParser.json({ limit: "50mb" }));

app.use(
  BodyParser.urlencoded({
    extended: false,
    limit: "50mb"
  })
);

app.use("/api/v1", Routes);

app.get("/", (req, res) => {
  res.status(200).send({
    status: true,
    message: "😊",
    data: {
      service: "Musikals",
      version: "1.0"
    }
  });
});

app.get('/greet', (req, res) => {
  res.json({ message: res.__('greeting') }); // '__' is used to access translations
});

// Example route with farewell message
app.get('/bye', (req, res) => {
  res.json({ message: res.__('farewell') });
});

// Simulate a database module
const db = {
  query: async (query) => {
      // Simulate a database query
      if (query === 'SELECT 1') {
          return Promise.resolve();
      }
      // Simulate a load query
      if (query === 'SELECT COUNT(*) FROM pg_stat_activity') {
          return Promise.resolve({ rows: [{ count: 5 }] });
      }
      return Promise.reject('Unknown query');
  }
};
// Middleware to count requests in queue
let requestQueueLength = 0;
app.use((req, res, next) => {
  requestQueueLength++;
  res.on('finish', () => requestQueueLength--);
  next();
});
// Health check functions
const checkDatabaseConnection = async () => {
  try {
      await db.query('SELECT 1');
      return 'Database is connected';
  } catch (error) {
      throw new Error('Database is not connected');
  }
};
const getDatabaseLoad = async () => {
  try {
      const load = await db.query('SELECT COUNT(*) FROM pg_stat_activity');
      return load.rows[0].count;
  } catch (error) {
      throw new Error('Unable to determine database load');
  }
};
const getServerLoad = () => {
  return {
      cpuLoad: os.loadavg(),
      memoryUsage: process.memoryUsage()
  };
};
const getQueueLength = () => requestQueueLength;
let errorCount = 0;
app.use((err, req, res, next) => {
  errorCount++;
  next(err);
});
const getErrorRate = () => errorCount;
const checkExternalService = async () => {
  try {
    const response = await axios.get('https://external-service.com/health');
    if (response.status !== 200) throw new Error('External service is down');
    return 'External service is up';
  } catch (error) {
    throw new Error('External service is down');
  }
};
const checkDiskSpace = () => {
  const free = os.freemem();
  const total = os.totalmem();
  return { free, total };
};
const checkNetworkLatency = async () => {
  const start = Date.now();
  try {
    await axios.get('https://your-service.com');
    const latency = Date.now() - start;
    return latency;
  } catch (error) {
    throw new Error('Failed to fetch from service');
  }
};
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
      const uptime = os.uptime();
      const databaseConnection = await checkDatabaseConnection();
      const databaseLoad = await getDatabaseLoad();
      const serverLoad = getServerLoad();
      const queueLength = getQueueLength();
      const errorRate = getErrorRate();
      // const externalServiceStatus = await checkExternalService();
      const diskSpace = checkDiskSpace();
      // const networkLatency = await checkNetworkLatency();
      res.status(200).json({
          status: 'UP',
          uptime,
          databaseConnection,
          databaseLoad,
          serverLoad,
          queueLength,
          errorRate,
          // externalServiceStatus,
          diskSpace,
          // networkLatency
      });
  } catch (error) {
      res.status(500).json({ status: 'DOWN', error: error.message });
  }
});


// Handles all errors
app.use(async (err, req, res, next) => {
  try {
    if (err.status === 500 || err.status === 502) {
      console.log("Service-School-House-error-logs", err);
      logger.error(`Error (${req.method} ${req.originalUrl}): ${err.message}`); 
      // logger.info(`Error: ${err.message}`);
      return res
          .status(500)
          .send({ success: false, message: err.message });
    }
    return res
          .status(500)
          .send({ success: false, message: err.message });
  } catch (error) {
      console.error(error);
      logger.error(`Error: ${error}`);
    return res
      .status(500)
      .send({ success: false, message: error });
  } 
});

// Not found route
app.use((req, res) => {
  return res.status(404).send({ success: false, message: "Route not found" });
});


module.exports = app;
