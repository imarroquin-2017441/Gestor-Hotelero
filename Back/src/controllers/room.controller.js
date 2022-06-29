'use strict'

const Room = require('../models/room.model');
const Hotel = require('../models/hotel.model');
const User = require('../models/user.model');
const { validateData, checkUpdateRoom } = require('../utils/validate');

exports.testRoom = async(req, res)=>{
    return res.send({message: 'Hola'});
}

exports.saveRoom = async(req, res)=>{
    try{

        const userLog = req.user.sub;
        const userExist = await User.findOne({_id: userLog});
        if(userExist.role != 'ADMINH') return res.status(400).send({message: 'Solo un usuario administrador de hotel puede agregar habitaciones a su hotel'});
        const hotelExist = await Hotel.findOne({user: userLog});
        if(!hotelExist) return res.status(400).send({message: 'Este usuario no cuenta con un hotel'})
        const params = req.body;
        const data = {
            type: params.type,
            available: params.available,
            price: params.price,
            hotel: hotelExist._id
        }

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const typeExist = await Room.findOne({type: {$regex: params.type, $options: 'i'}, hotel: hotelExist._id});
        if(typeExist) return res.status(400).send({message: 'Este tipo de habitacion ya esta registrada en el hotel'});

        const room = new Room(data);
        await room.save();
        return res.send({message: 'Habitacion guardada satisfactoriamente'});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error guardando habitacion'});
    }
}

exports.updateRoom = async(req, res)=>{
    try{

        const roomId = req.params.id;
        const params = req.body;

        const checkUpdate = await checkUpdateRoom(params);
        if(checkUpdate === false) return res.status(400).send({message: 'No han sido enviado los params para actualizar o no se pueden actualizar'});
        const roomExist = await Room.findOne({_id: roomId});
        const hotelExist = await Hotel.findOne({_id: roomExist.hotel});
        const userExist = await User.findOne({_id: req.user.sub});
        if(hotelExist.user != req.user.sub && userExist.role != 'ADMIN') return res.status(400).send({message: 'No tienes permiso para actulizar esta habitacion'});
        const typeExist = await Room.findOne({type: {$regex: params.type, $options: 'i'}, hotel: hotelExist._id});
        if(typeExist) return res.status(400).send({message: 'Este tipo de habitacion ya esta registrada en el hotel'});
        const roomUpdated = await Room.findOneAndUpdate({_id: roomId}, params, {new: true});
        if(!roomUpdated) return res.status(400).send({message: 'Habitacion no actualizada'});
        return res.send({message: 'Habitacion actualizada satisfactoriamente'});

    }catch(err){
        console.log(err)
        return res.status(500).send({message: 'Error actualizando habitacion'})
    }
}

exports.deleteRoom = async(req, res)=>{
    try{

        const roomId = req.params.id;

        const roomExist = await Room.findOne({_id: roomId});
        const hotelExist = await Hotel.findOne({_id: roomExist.hotel});
        const userExist = await User.findOne({_id: req.user.sub});
        if(hotelExist.user != req.user.sub && userExist.role != 'ADMIN') return res.status(400).send({message: 'No tienes permiso para eliminar esta habitacion'});
        const roomDeleted = await Room.findOneAndDelete({_id: roomId});
        if(!roomDeleted) return res.status(400).send({message: 'No se pudo eliminar la habitacion'});
        return res.send({message: 'Habitacion eliminada', type: roomDeleted.type});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error eliminadno la habitacion'});
    }
}

exports.getRoomsByAdmin = async(req, res)=>{
    try{
        const userLog = req.user.sub;
        const hotel = await Hotel.findOne({user: userLog});
        if(!hotel) return res.status(400).send({message: 'Usuario no asignado a algun Hotel'});
        const rooms = await Room.find({hotel: hotel.id});
        if(rooms == '') return res.status(400).send({message: 'Habitaciones no asignadas aun'})
        return res.send({message: 'Habitaciones encontradas', rooms});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error obteniendo habitaciones'});
    }
}

exports.getRoomsById = async(req, res)=>{
    try{
        const hotelId = req.params.id;
        const hotelExist = await Hotel.findOne({_id: hotelId})
        const rooms = await Room.find({hotel: hotelId});
        if(rooms == '') return res.status(400).send({message: 'El hotel no cuenta actualmente con habitaciones'});
        return res.send({message: 'Habitaciones del hotel: ', name: hotelExist.name, rooms})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error obteniendo habitaciones'});
    }
}

exports.saveRoomsByAdmin = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            type: params.type,
            available: params.available,
            price: params.price,
            hotel: params.hotel
        }

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const hotelExist = await Hotel.findOne({_id: params.hotel});
        if(!hotelExist) return res.status(400).send({message: 'Hotel no existente'});
        const roomsExist = await Room.findOne({type: {$regex: params.type, $options: 'i'}, hotel: params.hotel});
        if(roomsExist) return res.status(400).send({message: 'Este tipo de habitacion ya existe para el hotel, utilice otro'});

        const room = new Room(data);
        await room.save();
        return res.send({message: 'Habitacion guardada satisfactoriamente'});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error guardando Habitaciones'})
    }
}