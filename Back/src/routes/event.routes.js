'use strict'

const express = require('express');
const eventController = require('../controllers/event.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/pruebaEvent', eventController.testEvent);
api.post('/saveEvent', [mdAuth.ensureAuth, mdAuth.isAdminHo], eventController.saveEvent);
api.get('/getEventsByHotel', [mdAuth.ensureAuth, mdAuth.isAdminHo], eventController.getEventByAdmin);
api.get('/getEventsById/:id', mdAuth.ensureAuth, eventController.getEventsById);

api.put('/updateEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdminHo], eventController.updateEvent);
api.delete('/deleteEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdminHo], eventController.deleteEvent);

api.post('/saveEvents', [mdAuth.ensureAuth, mdAuth.isAdmin], eventController.saveEventsByAdmin);

module.exports = api;