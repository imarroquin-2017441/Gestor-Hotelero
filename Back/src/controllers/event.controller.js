'use strict'

const Event = require('../models/event.model');
const Hotel = require('../models/hotel.model');
const User = require('../models/user.model');
const { validateData, checkUpdateEvent } = require('../utils/validate');

exports.testEvent = async(req, res)=>{
    return res.send({message: 'Hola'});
}

exports.saveEvent = async(req, res)=>{
    try{

        const userLog = req.user.sub;
        const userExist = await User.findOne({_id: userLog});
        if(userExist.role != 'ADMINH') return res.status(400).send({message: 'Solo un administrador de hotel puede agregar eventos a su hotel'});
        const hotelExist = await Hotel.findOne({user: userLog});
        if(!hotelExist) return res.status(400).send({message: 'Este usuario no cuenta con un Hotel asignado'});
        const params = req.body;
        const data = {
            name: params.name,
            price: params.price,
            hotel: hotelExist._id
        }

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const nameExist = await Event.findOne({name: {$regex: params.name, $options: 'i'}, hotel: hotelExist._id});
        if(nameExist) return res.status(400).send({message: 'Este nombre de evento ya esta registrado en el hotel'});
        
        const event = new Event(data);
        await event.save();
        return res.send({message: 'Evento guardado satisfactoriamente'});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error guardando evento'});
    }
}

exports.updateEvent = async(req, res)=>{
    try{

        const eventId = req.params.id;
        const params = req.body;

        const chechUpdate = await checkUpdateEvent(params);
        if(chechUpdate === false) return res.status(400).send({message: 'No han sido enviado los params para actualizar o no se pueden actualizar'});
        const eventExist = await Event.findOne({_id: eventId});
        const hotelExist = await Hotel.findOne({_id: eventExist.hotel});
        const userExist = await User.findOne({_id: req.user.sub});
        if(hotelExist.user != req.user.sub && userExist.role != 'ADMIN') return res.status(400).send({message: 'No tienes permiso para actulizar este evento'});
        const nameExist = await Event.findOne({name: {$regex: params.name, $options: 'i'}, hotel: hotelExist._id})
        if(nameExist) return res.status(400).send({message: 'Este evento ya existe en este hotel'})
        const eventUpdated = await Event.findOneAndUpdate({_id: eventId}, params, {new: true});
        if(!eventUpdated) return res.status(400).send({message: 'Evento no actualizado'});
        return res.send({message: 'Evento actualizado satisfactoriamente'});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error actualizando evento'})
    }
}

exports.deleteEvent = async(req, res)=>{
    try{

        const eventId = req.params.id;

        const eventExist = await Event.findOne({_id: eventId});
        const hotelExist = await Hotel.findOne({_id: eventExist.hotel});
        const userExist = await User.findOne({_id: req.user.sub});
        if(hotelExist.user != req.user.sub && userExist.role != 'ADMIN') return res.status(400).send({message: 'No tienes permiso para eliminar este evento'});
        const eventDeleted = await Event.findOneAndDelete({_id: eventId});
        if(!eventDeleted) return res.status(400).send({message: 'No se pudo eliminar el evento'});
        return res.send({message: 'Evento eliminado', name: eventDeleted.name});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error eliminando el evento'});
    }
}

exports.getEventByAdmin = async(req, res)=>{
    try{
        const userLog = req.user.sub;
        const hotel = await Hotel.findOne({user: userLog});
        if(!hotel) return res.status(400).send({message: 'Usuario no asignado a algun Hotel'});
        const events = await Event.find({hotel: hotel.id});
        if(events == '') return res.status(400).send({message: 'Eventos no asignados aun'});
        return res.send({message: 'Eventos encontrados', events});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error obteniendo eventos'})
    }
}

exports.getEventsById = async(req, res)=>{
    try{
        const hotelId = req.params.id;
        const hotelExist = await Hotel.findOne({_id: hotelId});
        const events = await Event.find({hotel: hotelId});
        if(events == '') return res.status(400).send({message: 'El hotel no cuenta con eventos'});
        return res.send({message: 'Eventos del hotel: ', name: hotelExist.name, events})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error obteniendo eventos'});
    }
}

exports.saveEventsByAdmin = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            price: params.price,
            hotel: params.hotel
        }

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const hotelExist = await Hotel.findOne({_id: params.hotel});
        if(!hotelExist) return res.status(400).send({message: 'Hotel no existente'});
        const eventsExist = await Event.findOne({name: {$regex: params.name, $options: 'i'}, hotel: params.hotel});
        if(eventsExist) return res.status(400).send({message: 'Este nombre de evento ya existe en este hotel, porfavor utilice otro'});

        const event = new Event(data);
        await event.save();
        return res.send({message: 'Evento guardado satisfactoriamente'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error guardando eventos'});
    }
}