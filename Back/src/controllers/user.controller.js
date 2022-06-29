'use strict'

const User = require('../models/user.model');
const { validateData, alreadyUser, encrypt, 
    checkPassword, checkPermission, checkUpdate} = require('../utils/validate');
const jwt = require('../services/jwt');
const Hotel = require('../models/hotel.model');

exports.prueba = async (req, res)=>{
    await res.send({message: 'Simon, si sirve'});
}

//Funcionalidades de usaurio
exports.register = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            email: params.email,
            phone: params.phone,
            password: params.password,
            role: 'CLIENT'
        };
        const msg = validateData(data);

        if(msg) return res.status(400).send(msg);
        const already = await alreadyUser(data.username);
        if(already) return res.status(400).send({message: 'Username ya en uso, utilice otro'});
        data.surname = params.surname;
        data.password = await encrypt(params.password);

        const user = new User(data);
        await user.save();
        return res.send({message: 'Usuario creado satisfactoriamente'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error guardando al usuario'});
    }
}

exports.login = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            username: params.username,
            password: params.password
        }
        const msg = validateData(data);

        if(msg) return res.status(400).send(msg);
        const already = await alreadyUser(params.username);
        if(already && checkPassword(data.password, already.password)){
            let token = await jwt.createToken(already);
            delete already.password;

            return res.send({message: 'Inicio de sesión exitoso', already, token});
        }else return res.status(401).send({message: 'Credenciales invalidas'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Fallo al iniciar sesión'});
    }
}

exports.update = async(req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'Usuario no encontrado'});
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false)return res.status(401).send({message: 'No tienes los permisos para actualizar a este usuario'});
        const validateUpdate = await checkUpdate(params);
        if(validateUpdate === false) return res.status(400).send({message: 'No se pueden actualizar esa informacion o params invalidos'});
        let alreadyname = await alreadyUser(params.username);
        if(alreadyname && userExist.username != params.username) return res.send({message: 'Username ya en uso, utilice otro'});
        const userUpdate = await User.findOneAndUpdate({_id: userId}, params, {new: true}).lean();
        if(userUpdate) return res.send({message: 'Usuario actualizado', userUpdate});
        return res.send({message: 'Usuario no actualizado'});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Fallo al actualizar usuario'});
    }
}

exports.delete = async(req, res)=>{
    try{
        const userId = req.params.id;
        const persmission = await checkPermission(userId, req.user.sub);
        if(persmission === false) return res.status(403).send({message: 'No tienes los permisos para eliminar a esta usuario'});
        await Hotel.deleteMany({user: userId});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(userDeleted) return res.send({message: 'Cuenta eliminada', userDeleted});
        return res.send({message: 'Usario no encontrado o ya eliminado'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error eliminando usuario'})
    }
}

//Funcion de crear un ADMIN al iniciarlizar la aplicacion (No tocar >:c)
exports.saveAdmin = async(req, res)=>{
    try{
        const data = {
            username: 'ADMIN',
            password: 'ADMIN123',
            role: 'ADMIN'
        };
        const user = await User.find();
        if (user.length == 0){
            data.password = await encrypt(data.password);
            const admin = new User(data);
            await admin.save();
        }
    }catch(err){
        console.log(err);
        return console.log({err});
    }
}

//traer todos los usuarios, pero solo el ADMIN
exports.getUsers = async(req, res)=>{
    try{
        const users = await User.find().lean();
        if(users.lenght == 0) {
            res.status(400).send({message: 'Usuarios no encontrados'});
        } else {
            return res.send({users});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error consiguiendo los datos'})
    }
}

//Guardar un Admin de Hotel
exports.registerAdminH = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            email: params.email,
            phone: params.phone,
            password: params.password,
            role: 'ADMINH'
        };
        const msg = validateData(data);

        if(msg) return res.status(400).send(msg);
        const already = await alreadyUser(params.username);
        if(already) return res.status(400).send({message: 'Username ya en uso, use otro'});
        data.surname = params.surname;
        data.password = await encrypt(params.password);

        let user = new User(data);
        await user.save();
        return res.send({message: 'Usuario creado satisfactoriamente'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error guardando al usuario'});
    }
}

exports.updateUser = async(req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'Usuario no encontrado'});
        const emptyParams = await checkUpdate(params);
        if(emptyParams === false) return res.status(400).send({message: 'Params vacios o params no actualizables'});
        if(userExist.role === 'ADMIN') return res.status(400).send({message: 'No se puede actualizar al ADMIN'});
        const nameAlready = await alreadyUser(params.username);
        if(nameAlready && userExist.username != params.username) return res.status(400).send({message: 'Username ya en uso, utilice'});
        const userUpdated = await User.findByIdAndUpdate({_id: userId}, params, {new: true});
        if(!userUpdated) return res.status(400).send({message: 'Usuario no actualizado'});
        return res.send({message: 'Usuario actualizado satisfactoriamente', userUpdated});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error actualizando usuario'});
    }
}

exports.deleteUser = async(req, res)=>{
    try{
        const userId = req.params.id;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'Usuario no encontrado'});
        if(userExist.role === 'ADMIN') return res.status(400).send({message: 'No se puede eliminar a un usuario con role ADMIN'});
        await Hotel.deleteMany({user: userId})
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(!userDeleted) return res.status(400).send({message: 'Usuario no eliminado'});
        return res.send({message: 'Usuario eliminado satisfactoriamente'})
        
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error eliminando al usuario'});
    }
}