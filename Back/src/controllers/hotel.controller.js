'use strict'

const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const { validateData, checkUpdateHotel } = require('../utils/validate');
const Room = require('../models/room.model');
const eventModel = require('../models/event.model');
const Reser = require('../models/reservation.model');

exports.testHotel = (req, res)=>{
    return res.send({message: 'Hola'});
}

exports.saveHotel = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            direction: params.direction,
            email: params.email,
            phone: params.phone,
            user: params.user
        }

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const userExist = await User.findOne({_id: params.user});
        if(!userExist) return res.status(400).send({message: 'Usuario no encontrado'});
        if(userExist.role != 'ADMINH') return res.status(400).send({message: 'Usuario no valido para ser ADMIN de Hotel'});
        const hotelExist = await Hotel.findOne({user: params.user});
        if(hotelExist) return res.status(400).send({message: 'Este usuario ya es ADMIN de un Hotel, pruebe con otro'});
        //const directionExist = await Hotel.find({direction: {$regex: params.direction, $options: 'i'}});
        //if(directionExist) return res.status(400).send({message: 'Direccion de hotel ya en uso, utilice otra'});

        const hotel = new Hotel(data);
        await hotel.save();
        return res.send({message: 'Hotel guardado satisfactoriamente'})

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error guardando un hotel'})
    }
}

exports.updateHotel = async(req, res)=>{
    try{
        const hotelId = req.params.id;
        const params = req.body;

        const checkUpdate = await checkUpdateHotel(params);
        if(checkUpdate === false) return res.status(400).send({message: 'No han sido enviado los params para actualizar o no se pueden actualizaro hasn sido enviado los params para actualizar o no se pueden actualizar'});
        const hotelExist = await Hotel.findOne({_id: hotelId})
        const userExist = await User.findOne({_id: req.user.sub});
        if(hotelExist.user != req.user.sub && userExist.role != 'ADMIN') return res.status(400).send({message: 'No tiene permiso para actualizar este hotel'})
        const hotelUpdated = await Hotel.findOneAndUpdate({_id: hotelId}, params, {new: true});
        if(!hotelUpdated) return res.status(400).send({message: 'Hotel no existente'});
        return res.send({message: 'Hotel actualizado satisfactoriamente', hotelUpdated});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error actualizando hotel'});
    }
}

exports.deleteHotel = async(req, res)=>{
    try{
        const hotelId = req.params.id;

        const hotelExist = await Hotel.findOne({_id: hotelId})
        if(!hotelExist) return res.status(400).send({message: 'Hotel no encontrado'})
        const userExist = await User.findOne({_id: req.user.sub});
        if(hotelExist.user != req.user.sub && userExist.role != 'ADMIN') return res.status(400).send({message: 'No tiene permiso para eliminar este hotel'});
        await Room.deleteMany({hotel: hotelId});
        await eventModel.deleteMany({hotel: hotelId});
        const hotelDeleted = await Hotel.findOneAndDelete({_id: hotelId});
        if(!hotelDeleted) return res.send({message: 'No se pudo eliminar el hotel'});
        return res.send({message: 'Hotel Eliminado', name: hotelDeleted.name});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error eliminando Hotel'})
    }
}

exports.getHotels = async(req, res)=>{
    try{
        const hoteles = await Hotel.find()
        .lean();
        return res.send({message: 'Hoteles encontrados', hoteles});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error obteniendo los hoteles'});
    }
}

exports.getHotel = async(req, res)=>{
    try{
        const userLog = req.user.sub;
        const hotel = await Hotel.findOne({user: userLog})
        .lean();
        return res.send({message: 'Hotel encontrado', hotel});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error obteniendo el Hotel'});
    }
}

exports.getHotelId = async(req, res)=>{
    try{
        const hotelId = req.params.id;
        const userLog = req.user.sub;
        const userExist = User.findOne({_id: userLog})
        const hotel = await Hotel.findOne({_id: hotelId});
        if (hotel.user != userLog && userExist.role != 'ADMIN') return res.status(400).send({message: 'No tiene permitido visualizar este hotel'});
        return res.send({message: 'Hotel encontrado', hotel})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error obteniendo el Hotel'})
    }
}

exports.searchByName = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name
        }

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const hoteles = await Hotel.find({name: {$regex: params.name, $options: 'i'}})
        .lean();
        if(hoteles == '') return res.status(400).send({message: 'Hoteles no encontrados'})
        return res.send({hotel: hoteles});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error buscando el hotel'});
    }
}

exports.searchByDirection = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            direction: params.direction
        }

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const hoteles = await Hotel.find({direction: {$regex: params.direction, $options: 'i'}})
        .lean();
        if(hoteles == '') return res.status(400).send({message: 'Hoteles no encontrados'})
        return res.send({hotel: hoteles});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error buscando el hotel'});
    }
}

exports.usersByHotel = async(req, res)=>{
    try{
        const userLog = req.user.sub;
        const hotel = await Hotel.findOne({user: userLog});
        const users = await Reser.find({hotel: hotel._id})
        .lean()
        .populate('user', 'username name email phone');
        if(users == '') return res.status(400).send({message: 'Actualmente, no se cuentan con reservaciones'});
        return res.send({message: 'reservaciones encontradas', users});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error obteniendo usuarios por hotel'})
    }
}