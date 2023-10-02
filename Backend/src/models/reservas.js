import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const reservasSchema = new Schema({
    codigo:{
        type:Number,
        require:true,
        trim:true
    },
    descripcion:{
        type:String,
        require:true,
        trim:true
    },
    id_conferencista:{
        type:Number,
        require:true,
        trim:true
    },
    id_auditorio:{
        type:Number,
        require:true,
        trim:true
    }
},{
    timestamps:true
})

export default model('reservas',reservasSchema)