'use strict'

const mongoConfig = require('./configs/mongoConfig');
const app = require('./configs/app');
const port = 3200;
const user = require('./src/controllers/user.controller')

mongoConfig.init();

app.listen(port,()=>{
    console.log(`Servidor corriendo en el puerto ${port}`);
    user.saveAdmin();
});