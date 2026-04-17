const express = require('express');
const {isAuth} = require('../MIDDLEWARE/isAuth');
const { getCurrentUser } = require('../CONTROLLER/user.controller');

const UserRouter = express.Router();

UserRouter.get("/current-user", isAuth, getCurrentUser);

module.exports = UserRouter;