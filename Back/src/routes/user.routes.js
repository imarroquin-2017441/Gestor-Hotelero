'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/pruebaUser', userController.prueba);
api.post('/register', userController.register);
api.post('/login', userController.login);

api.put('/updateUser/:id', mdAuth.ensureAuth, userController.update);
api.delete('/deleteUser/:id', mdAuth.ensureAuth, userController.delete);

api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.getUsers);
api.post('/saveAdminHotel', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.registerAdminH);
api.put('/updateUserByAdmin/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.updateUser);
api.delete('/deleteUserByAdmin/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.deleteUser);

module.exports = api;