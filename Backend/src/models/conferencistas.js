import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const conferencistasSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    apellido:{
        type:String,
        require:true,
        trim:true
    },
    cedula:{
        type:Number,
        require:true,
        trim:true
    },
    genero:{
        type:String,
        require:true,
        trim:true
    },
    ciudad:{
        type:String,
        require:true,
        trim:true
    },
    direccion:{
        type:String,
        require:true,
        trim:true
    },
    fecha_nacimiento:{
        type:Date,
        require:true,
        trim:true
    },
    telefono:{
        type:Number,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true
    },
    empresa:{
        type:String,
        require:true,
        trim:true
    },
},{
    timestamps:true
})

export default model('conferencistas',conferencistasSchema)