import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const auditoriosSchema = new Schema({
    codigo:{
        type:String,
        require:true,
        trim:true
    },
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    ubicacion:{
        type:String,
        require:true,
        trim:true
    },
    capacidad:{
        type:String,
        require:true
    },
    descripcion:{
        type:String,
        require:true
    }
},{
    timestamps:true
})

export default model('auditorios',auditoriosSchema)