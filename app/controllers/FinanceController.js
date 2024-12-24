const axios = require("axios");

const { Sequelize, Op, where } = require("sequelize");
const sequelize = require("../../database/PostgresDb");
const User = require("../../models/User");
const UserSong = require("../../models/UserSong");
const UserWallet = require("../../models/UserWallet");
const FundTransaction = require("../../models/FundTransaction");
const HelperService = require("../services/HelperService");
const ShowLoveCategory = require("../../models/ShowLoveCategory");
const Stream = require("../../models/Stream");
const WalletTransaction = require("../../models/WalletTransaction");
const UserBankAccount = require("../../models/UserBankAccount");

exports.saveBankAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { bankName, bankAccountName, bankAccountNumber, swiftCode, bvn } =
      req.body;

    // Find the user
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Check if a bank account for the user already exists
    const existingBankAccount = await UserBankAccount.findOne({
      where: { userId },
    });

    if (existingBankAccount) {
      // Update the existing bank account
      await existingBankAccount.update({
        bankName,
        bankAccountName,
        bankAccountNumber,
        swiftCode,
        bvn,
      });

      return res.status(200).send({
        success: true,
        message: "Bank account updated successfully.",
      });
    } else {
      // Create a new bank account
      await UserBankAccount.create({
        userId,
        bankName,
        bankAccountName,
        bankAccountNumber,
        swiftCode,
        bvn,
      });

      return res.status(201).send({
        success: true,
        message: "Bank account created successfully.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.initiateFundWallet = async (req, res, next) => {
  const { amount, callBackUrl } = req.body;
  const { userId } = req.params;

  // Validate input
  if (!amount || amount <= 0) {
    return res.status(400).send({
      success: false,
      message: "Invalid amount. It must be a positive number.",
    });
  }

  if (!callBackUrl) {
    return res.status(400).send({
      success: false,
      message: "Please add a call back url.",
    });
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      // Fetch user email
      const user = await User.findOne({
        where: { id: userId },
        attributes: ["email"],
        transaction: t,
      });

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found.",
        });
      }

      // Get or create user wallet
      const [userWallet] = await UserWallet.findOrCreate({
        where: { userId },
        defaults: { balance: 0 },
        transaction: t,
      });

      // Prepare Paystack API request
      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
      const paystackResponse = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: user.email,
          amount: amount * 100, // Convert to kobo (Paystack's smallest currency unit)
          callback_url: callBackUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Destructure response
      const { authorization_url, access_code, reference } =
        paystackResponse.data.data;

      if (!authorization_url) {
        throw new Error("Failed to initialize Paystack transaction.");
      }

      // Record wallet transaction
      await WalletTransaction.create(
        {
          walletId: userWallet.id,
          amount,
          previousBalance: userWallet.balance,
          newBalance: userWallet.balance, // No balance change yet
          type: "deposit",
          status: "pending",
          paymentMethod: "paystack",
          referenceId: reference,
          accessCode: access_code,
        },
        { transaction: t }
      );

      return { authorizationUrl: authorization_url };
    });

    // Respond with authorization URL
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error during wallet funding initialization:", error.message);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.finalizeFundWallet = async (req, res, next) => {
  const { trxref, status } = req.body;

  if (status !== "success") {
    return res.status(400).send({ message: "Transaction failed" });
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      // Find the wallet transaction by reference ID
      const walletTransaction = await WalletTransaction.findOne({
        where: { referenceId: trxref },
        transaction: t,
      });

      if (!walletTransaction) {
        throw new Error("Transaction invalid");
      }

      // Check if the transaction has already been processed
      if (walletTransaction.status === "success") {
        return { status: "exists" };
      }
      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

      const verifyResponse = await axios({
        method: "get",
        url: `https://api.paystack.co/transaction/verify/${trxref}`,
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      });

      if (
        verifyResponse.data &&
        verifyResponse.data.data.status === "success"
      ) {
        // Update wallet transaction status and balance
        const newBalance =
          walletTransaction.previousBalance + walletTransaction.amount;

        await walletTransaction.update(
          {
            newBalance,
            status: "success",
          },
          { transaction: t }
        );

        // Increment user wallet balance
        await UserWallet.increment(
          { balance: walletTransaction.amount },
          { where: { id: walletTransaction.walletId }, transaction: t }
        );

        return { status: "success" };
      }
      return { status: "error" };
    });

    if (result.status === "exists") {
      return res.status(200).send({
        message: "Funding already approved",
      });
    }

    if (result.status === "error") {
      return res.status(400).send({
        message: "An error occured",
      });
    }

    return res.status(200).send({
      message: "Funding successful",
    });
  } catch (error) {
    console.error("Error finalizing wallet funding:", error.message);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.userWallet = async (req, res, next) => {
  await sequelize.transaction(async (t) => {
    try {
      const { amount } = req.body;
      const { userId } = req.params;

      // Validate amount
      if (!amount || amount <= 0) {
        throw new Error("Invalid amount. It must be a positive number.");
      }

      // Find or create user wallet
      const [userWallet] = await UserWallet.findOrCreate({
        where: { userId },
        defaults: { balance: 0 },
        transaction: t, // Use transaction
      });

      return res.status(200).json({ success: true, userWallet });
    } catch (error) {
      console.error(error);
      t.rollback();
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  });
};

exports.fundArtiste = async (req, res, next) => {
  await sequelize.transaction(async (t) => {
    try {
      const { artisteId, amount, type, songId, showLoveId } = req.body;
      const { userId } = req.params;

      if (userId === artisteId) {
        throw new Error("You cannot fund yourself.");
      }

      const [funderWallet] = await UserWallet.findOrCreate({
        where: { userId },
        defaults: { balance: 0 },
        transaction: t,
      });

      if (funderWallet.balance < amount) {
        return res
          .status(422)
          .send({ success: false, message: "Insufficient funds in wallet." });
      }

      const [artisteWallet] = await UserWallet.findOrCreate({
        where: { userId: artisteId },
        defaults: { balance: 0 },
        transaction: t,
      });

      if (type === "show love") {
        const previousFunderBalance = funderWallet.balance;
        const previousArtisteBalance = artisteWallet.balance;

        await funderWallet.decrement("balance", { by: amount, transaction: t });
        await artisteWallet.increment("balance", {
          by: amount,
          transaction: t,
        });

        await FundTransaction.create(
          {
            funderId: userId,
            artisteId,
            amount,
            songId,
            showLoveId,
            type: "show love",
          },
          { transaction: t }
        );

        await WalletTransaction.create(
          {
            walletId: funderWallet.id,
            type: "withdrawal",
            amount,
            previousBalance: previousFunderBalance,
            newBalance: previousFunderBalance - amount,
            // description: `Funded artiste with ID ${artisteId}.`,
          },
          { transaction: t }
        );

        await WalletTransaction.create(
          {
            walletId: artisteWallet.id,
            type: "deposit",
            amount,
            previousBalance: previousArtisteBalance,
            newBalance: previousArtisteBalance + amount,
            // description: `Received funding from user with ID ${userId}.`,
          },
          { transaction: t }
        );

        return res
          .status(201)
          .send({ success: true, message: "Artiste funded successfully." });
      } else {
        return res.status(200).send({ success: true, message: "Coming soon" });
      }
    } catch (error) {
      console.error(error);
      t.rollback();
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  });
};

exports.investorsTransactions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      attributes,
      page = 1,
      perPage = 25,
      sortBy,
      sort = "createdAt:desc",
      order,
      status,
      search,
      include: includes,
      ...otherAttributes
    } = req.query;

    let whereConditions = {};
    if (search) {
      // whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const paginate = HelperService.pagination({ page, perPage });

    const transactions = await FundTransaction.findAndCountAll({
      where: {
        funderId: userId,
      },
      include: [
        {
          model: User,
          as: "artiste",
          attributes: ["id", "name", "username"],
        },
        {
          model: UserSong,
          as: "song",
          attributes: ["id", "title", "coverImage"],
        },
        {
          model: ShowLoveCategory,
          as: "category",
          attributes: ["id", "title"],
        },
      ],
      // attributes: ["id", "title", "coverImage", "filePath"],
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const meta = HelperService.paginationLink({
      total: transactions.count,
      page,
      perPage,
    });
    return res.send({ data: transactions.rows, meta });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.investorsSummary = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const contributions = await FundTransaction.count({
      where: {
        funderId: userId,
      },
    });

    const artistes = await FundTransaction.count({
      where: {
        funderId: userId,
      },
      col: "artisteId",
      distinct: true,
    });

    // Get the start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

    // Contributions for today
    const contributionsToday = await FundTransaction.count({
      where: {
        funderId: userId,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    // Unique artistes for today
    const artistesToday = await FundTransaction.count({
      where: {
        funderId: userId,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      col: "artisteId",
      distinct: true,
    });

    const expectedReturn = 0;

    return res.send({
      data: {
        contributions,
        contributionsToday,
        artistes,
        artistesToday,
        expectedReturn,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.investorsTransactionsChart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const transactions = await FundTransaction.findAll({
      where: {
        funderId: userId,
      },
      include: [
        {
          model: ShowLoveCategory,
          as: "category",
          attributes: ["id", "title"],
        },
      ],
      attributes: [
        "showLoveId",
        [Sequelize.fn("COUNT", Sequelize.col("showLoveId")), "count"],
      ],
      group: ["fund_transactions.showLoveId", "category.id"],
    });

    return res.send({ data: transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.investorsInvestmentChart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { year = new Date().getFullYear() } = req.query;

    const transactions = await FundTransaction.findAll({
      where: {
        funderId: userId,
        type: "invest",
        createdAt: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`),
        },
      },
      attributes: [
        [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalInvestments"],
      ],
      group: [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`)],
      order: [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt") ASC`)],
    });

    const monthlyInvestments = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalInvestments: 0,
    }));

    transactions.forEach((transaction) => {
      const month = parseInt(transaction.dataValues.month, 10);
      const totalInvestments = parseInt(
        transaction.dataValues.totalInvestments,
        10
      );
      monthlyInvestments[month - 1].totalInvestments = totalInvestments;
    });

    return res.send({ data: monthlyInvestments });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.artisteStreamChart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { year = new Date().getFullYear() } = req.query;

    const streams = await Stream.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`),
        },
      },
      attributes: [
        [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalStreams"],
      ],
      group: [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`)],
      order: [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt") ASC`)],
    });

    const monthlyStreams = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalStreams: 0,
    }));

    streams.forEach((stream) => {
      const month = parseInt(stream.dataValues.month, 10);
      const totalStreams = parseInt(stream.dataValues.totalStreams, 10);
      monthlyStreams[month - 1].totalStreams = totalStreams;
    });

    return res.send({ data: monthlyStreams });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.artistesTransactions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      attributes,
      page = 1,
      perPage = 25,
      sortBy,
      sort = "createdAt:desc",
      order,
      status,
      search,
      include: includes,
      ...otherAttributes
    } = req.query;

    let whereConditions = {};
    if (search) {
      // whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const paginate = HelperService.pagination({ page, perPage });

    const transactions = await FundTransaction.findAndCountAll({
      where: {
        artisteId: userId,
      },
      include: [
        {
          model: User,
          as: "funder",
          attributes: ["id", "name", "username"],
        },
        // {
        //   model: UserSong,
        //   as: "song",
        //   attributes: ["id", "title", "coverImage"],
        // },
        // {
        //   model: ShowLoveCategory,
        //   as: "category",
        //   attributes: ["id", "title"],
        // },
      ],
      // attributes: ["id", "title", "coverImage", "filePath"],
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const meta = HelperService.paginationLink({
      total: transactions.count,
      page,
      perPage,
    });
    return res.send({ data: transactions.rows, meta });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.artistesSummary = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const contributions = await FundTransaction.count({
      where: {
        artisteId: userId,
      },
    });

    const artistes = await FundTransaction.count({
      where: {
        artisteId: userId,
      },
      col: "artisteId",
      distinct: true,
    });

    // Get the start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

    // Contributions for today
    const contributionsToday = await FundTransaction.count({
      where: {
        artisteId: userId,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    // Unique artistes for today
    const artistesToday = await FundTransaction.count({
      where: {
        artisteId: userId,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      col: "artisteId",
      distinct: true,
    });

    const expectedReturn = 0;

    return res.send({
      data: {
        contributions,
        contributionsToday,
        artistes,
        artistesToday,
        expectedReturn,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.artistesTransactionsChart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const transactions = await FundTransaction.findAll({
      where: {
        artisteId: userId,
      },
      include: [
        {
          model: ShowLoveCategory,
          as: "category",
          attributes: ["id", "title"],
        },
      ],
      attributes: [
        "showLoveId",
        [Sequelize.fn("COUNT", Sequelize.col("showLoveId")), "count"],
      ],
      group: ["fund_transactions.showLoveId", "category.id"],
    });

    return res.send({ data: transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.artistesInvestmentChart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { year = new Date().getFullYear() } = req.query;

    const transactions = await FundTransaction.findAll({
      where: {
        artisteId: userId,
        type: "invest",
        createdAt: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`),
        },
      },
      attributes: [
        [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalInvestments"],
      ],
      group: [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`)],
      order: [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt") ASC`)],
    });

    const monthlyInvestments = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalInvestments: 0,
    }));

    transactions.forEach((transaction) => {
      const month = parseInt(transaction.dataValues.month, 10);
      const totalInvestments = parseInt(
        transaction.dataValues.totalInvestments,
        10
      );
      monthlyInvestments[month - 1].totalInvestments = totalInvestments;
    });

    return res.send({ data: monthlyInvestments });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.initiatePayment = async (req, res, next) => {
  try {
    const { userId, amount, callBackUrl } = req.body;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      attributes: ["email"],
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    const response = await axios({
      method: "post",
      url: "https://api.paystack.co/transaction/initialize",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      data: {
        email: user.email,
        amount: amount * 100,
        callback_url: callBackUrl,
      },
    });

    const { authorization_url } = response.data.data;

    // Return the authorization URL to the frontend so the user can complete the payment
    return res.status(200).send({ authorizationUrl: authorization_url });
  } catch (error) {
    return next({
      status: 500,
      message: error.message,
    });
  }
};

exports.paystackWebhook = async (req, res, next) => {
  try {
    const { event, data } = req.body;

    // Paystack sends various event types; we focus on "charge.success"
    if (event === "charge.success") {
      const { reference, customer, amount } = data;

      const user = await User.findOne({
        where: {
          email: customer.email,
        },
        attributes: ["id"],
      });

      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

      // Verify the transaction using the transaction reference
      try {
        // const verifyResponse = await axios({
        //     method: 'get',
        //     url: `https://api.paystack.co/transaction/verify/${reference}`,
        //     headers: {
        //         Authorization: `Bearer ${paystackSecretKey}`,
        //     },
        // });

        // const { status: verificationStatus, customer: verifiedCustomer, amount: verifiedAmount } = verifyResponse.data.data;

        // if (verificationStatus === 'success') {
        await Transaction.create({
          userId: user.id,
          amount: amount / 100, // divide by 100 to get actual amount
          status: "success",
          paymentMethod: "paystack",
          reference,
        });

        return res.status(200).json({ success: true });
        // }
      } catch (error) {
        console.error("Error verifying Paystack transaction:", error);
        return res
          .status(500)
          .json({ error: "Transaction verification failed" });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return next({
      status: 500,
      message: error.message,
    });
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const {
      attributes,
      page = 1,
      perPage = 25,
      sortBy,
      sort = "createdAt:desc",
      order,
      status,
      search,
      include: includes,
      ...otherAttributes
    } = req.query;

    let whereConditions = {};
    if (search) {
      whereConditions[Op.or] = [{ name: { [Op.like]: "%" + search + "%" } }];
    }
    const paginate = HelperService.pagination({ page, perPage });

    const requests = await Transaction.findAndCountAll({
      // where: { ...whereConditions },
      include: [
        {
          model: User,
          as: "user",
          where: { ...whereConditions },
          attributes: ["name", "email", "phoneNumber"],
        },
      ],
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    if (requests.count === 0) {
      return res.status(200).send({
        success: true,
        data: [],
      });
    }
    const meta = HelperService.paginationLink({
      total: requests.count,
      page,
      perPage,
    });

    return res.status(200).send({ success: true, data: requests.rows, meta });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
