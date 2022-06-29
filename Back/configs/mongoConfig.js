'use strict'

const mongoose = require('mongoose');

exports.init = ()=>{
  //linea de conexión
  const uriMongo = 'mongodb://127.0.0.1:27017/gestorHotelero';
  mongoose.Promise = global.Promise;

  //manejar el ciclo de vida de la conexión
    mongoose.connection.on('error', ()=>{
        console.log('MongoDB | no se pudo connectar a mongodb');
        mongoose.disconnect();
    });
    mongoose.connection.on('connecting', ()=>{
        console.log('MongoDB | intentando conexion');
    });
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB | conectado a mongodb');
    });
    mongoose.connection.once('open', ()=>{
        console.log('MongoDB | conectado a la base de datos');
    });
   mongoose.connection.on('reconnected', ()=>{
       console.log('MongoDB | reconectando a mongodb');
   });
   mongoose.connection.on('disconnected', ()=>{
       console.log('MongoDB | desconectado');
   });

   //ejecutar método de conexión
   mongoose.connect(uriMongo, {
       connectTimeoutMS: 2500,
       maxPoolSize: 50,
       useNewUrlParser: true
   }).catch(err=>console.log(err));
}