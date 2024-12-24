const express = require("express");
const FinanceController = require("../app/controllers/FinanceController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  // , limits: { fileSize: 6 * 1024 * 1024 },
});
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/users/:userId/wallets/initiate-funding")
  .post(protect, FinanceController.initiateFundWallet);

router
  .route("/users/:userId/wallets/finalize-funding")
  .post(protect, FinanceController.finalizeFundWallet);

router
  .route("/users/:userId/wallets")
  .get(protect, FinanceController.userWallet);

router
  .route("/users/:userId/wallets/fund-artiste")
  .post(protect, FinanceController.fundArtiste);

router
  .route("/investors/:userId/transactions")
  .get(protect, FinanceController.investorsTransactions);

router
  .route("/investors/:userId/summary")
  .get(protect, FinanceController.investorsSummary);

router
  .route("/investors/:userId/transactions/summary/chart")
  .get(protect, FinanceController.investorsTransactionsChart);

router
  .route("/investors/:userId/investments/chart")
  .get(protect, FinanceController.investorsInvestmentChart);

router
  .route("/artistes/:userId/transactions")
  .get(protect, FinanceController.artistesTransactions);

router
  .route("/artistes/:userId/summary")
  .get(protect, FinanceController.artistesSummary);

router
  .route("/artistes/:userId/transactions/summary/chart")
  .get(protect, FinanceController.artistesTransactionsChart);

router
  .route("/artistes/:userId/investments/chart")
  .get(protect, FinanceController.artistesInvestmentChart);

module.exports = router;
