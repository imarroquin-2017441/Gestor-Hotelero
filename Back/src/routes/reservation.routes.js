'use strict'

const express = require('express');
const reserController = require('../controllers/reservation.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/pruebaReservation', reserController.pruebaReservation);
api.get('/getReservation', mdAuth.ensureAuth, reserController.getReservation);
api.delete('/cancelReservation', mdAuth.ensureAuth, reserController.cancelReservation);
api.delete('/payReservation', mdAuth.ensureAuth, reserController.payReservation);

api.post('/addRoomToReservation/:id', mdAuth.ensureAuth, reserController.addRoomsToReservation);
api.post('/addEventsToReservation', mdAuth.ensureAuth, reserController.addEventsToReservation);

module.exports = api;