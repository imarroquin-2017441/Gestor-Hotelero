'use strict'

const Reser = require('../models/reservation.model');
const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const Room = require('../models/room.model');
const Event = require('../models/event.model');
const { validateData } = require('../utils/validate');
const moment = require('moment');

exports.pruebaReservation = async(req, res)=>{
    return res.send({message: 'Hola'});
}

exports.addRoomsToReservation = async(req, res)=>{
    try{

        const roomId = req.params.id;
        const params = req.body;
        const userLog = req.user.sub;
        const data = {
            dateStart: params.dateStart,
            days: params.days,
            room: roomId,
            quantity: params.quantity
        }
        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const reserExist = await Reser.findOne({user: userLog});
        const roomExist = await Room.findOne({_id: roomId})
        .lean();
        if(!roomExist) return res.status(400).send({message: 'Habitacion Inexistente'});
        if(reserExist){
            if(params.quantity > roomExist.available) return res.status(400).send({message: 'No contamos con suficientes habitaciones para la cantidad deseada'});
            for(let room of reserExist.rooms){
                if(room._id != data.room) continue;
                return res.status(400).send({message: 'Ya cuentas con estas habitaciones en tu reservacion'});
            }
            const room = {
                room: roomId,
                quantity: params.quantity,
                subTotal: params.quantity * roomExist.price * params.days
            }
            const resta = {
                available: roomExist.available - params.quantity
            }
            const total = reserExist.rooms.map(room=>
                room.subTotal).reduce((prev, curr)=> prev + curr, 0)+ room.subTotal;
            const pushRoom = await Reser.findOneAndUpdate(
                {_id: reserExist._id},
                { $push: {rooms: room},
                total: total},
                {new: true}
            );
            const roomAva = await Room.findOneAndUpdate({_id: roomId}, resta, {new: true});
            return res.send({message: 'Nuevas habitaciones agregadas', pushRoom});
        }else{
            if(params.quantity > roomExist.available) return res.status(400).send({mesage: 'No contamos con suficientes habitaciones para la cantidad deseada'});
            const room = {
                room: roomId,
                quantity: params.quantity,
                subTotal: params.quantity * roomExist.price * params.days
            }
            const hotelExist = await Hotel.findOne({_id: roomExist.hotel});
            const data = {
                user: req.user.sub,
                dateStart: params.dateStart,
                days: params.days,
                hotel: hotelExist._id,
                rooms: room
            };
            const resta = {
                available: roomExist.available - params.quantity
            }
            data.total = room.subTotal;
            const reservation = new Reser(data);
            await reservation.save();
            const roomAva = await Room.findOneAndUpdate({_id: roomId}, resta, {new: true});
            return res.send({message: 'Habitacion/es agregadas satisfactoriamente', reservation});
        }

    }catch(err){
        console.log(err);
        return res.status(400).send({message: 'Error agregando la reservacion'});
    }
}