const RolePermissionService = require('../app/services/RolePermissionService');

const checkPermission = (requiredPermission) => async (req, res, next) => {
    try {
        // disable for now
        // // Get user role
        // const userRole = await RolePermissionService.getRoleById(req.user.roleId);
        // // Check if user have permission to access this route
        // const userPermissions = userRole.rolePermissions.map((rolePermission) => {
        //     return rolePermission.permission.slug;
        // });
        // if (userPermissions.includes(requiredPermission)) {
        //     next();
        // } else {
        //     return res.status(403).send({
        //         success: false,
        //         message: 'You are not authorized to perform this action'
        //     });
        // }
        next();
    } catch (error) {
      console.error(error);
        return next({
            status: 500,
            message: error.message,
        });
    }
};

module.exports = checkPermission;
