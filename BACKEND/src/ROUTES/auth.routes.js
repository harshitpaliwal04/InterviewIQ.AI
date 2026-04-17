const express = require('express');
const { CreateUserByGoogleAuth, LoginUserByGoogleAuth } = require('../CONTROLLER/auth.controller');

const Authrouter = express.Router();

Authrouter.post('/google', CreateUserByGoogleAuth);
Authrouter.get('/logout', LoginUserByGoogleAuth);

module.exports = Authrouter;