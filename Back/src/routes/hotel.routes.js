'use strict'

const express = require('express');
const hotelController = require('../controllers/hotel.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/getHotels', hotelController.getHotels);
api.post('/searchByName', hotelController.searchByName);
api.post('/searchByDirection', hotelController.searchByDirection);
api.get('/pruebaHotel', hotelController.testHotel);
api.post('/saveHotel', [mdAuth.ensureAuth, mdAuth.isAdmin], hotelController.saveHotel);
api.get('/getHotel', [mdAuth.ensureAuth, mdAuth.isAdminHo], hotelController.getHotel);
api.get('/getHotelId/:id', mdAuth.ensureAuth, hotelController.getHotelId);
api.get('/getUserByHotel', [mdAuth.ensureAuth, mdAuth.isAdminHo], hotelController.usersByHotel);

api.put('/updateHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdminHo], hotelController.updateHotel);
api.delete('/deleteHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdminHo], hotelController.deleteHotel);

module.exports = api;