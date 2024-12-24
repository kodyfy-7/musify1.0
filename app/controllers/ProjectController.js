const { Op } = require("sequelize");
const User = require("../../models/User");
const UserProject = require("../../models/UserProject");
const HelperService = require("../services/HelperService");

exports.saveProjectInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { title, description, goal } = req.body;

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

    // Update the user
    await UserProject.create({
      userId,
      title,
      description,
      goal,
    });

    return res.status(200).send({
      success: true,
      message: "Project saved successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.getArtisteProjects = async (req, res, next) => {
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

    let whereConditions = {};
    if (search) {
      whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const paginate = HelperService.pagination({ page, perPage });

    // Update the user
    const projects = await UserProject.findAndCountAll({
      where: {
        userId,
      },
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const meta = HelperService.paginationLink({
      total: projects.count,
      page,
      perPage,
    });

    return res.status(200).send({
      success: true,
      data: { success: true, data: projects.rows, meta },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
