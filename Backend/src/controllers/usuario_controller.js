import usuario from "../models/usuario.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";


const login = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const usuarioBDD = await usuario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await usuarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const token = generarJWT(usuarioBDD._id)
    const {nombre,apellido,_id} = usuarioBDD
    res.status(200).json({
        token,
        nombre,
        apellido,
        _id,
        email:usuarioBDD.email
    })
}

const perfil =(req,res)=>{
    delete req.usuarioBDD.token
    delete req.usuarioBDD.createdAt
    delete req.usuarioBDD.updatedAt
    delete req.usuarioBDD.__v
    res.status(200).json(req.usuarioBDD)
}

const registro = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await usuario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoUsuario = new usuario(req.body)
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password)
    nuevoUsuario.crearToken()
    await nuevoUsuario.save()
    res.status(200).json({msg:"Usuario registrado correctamente"})
}
const listarUsuarios = (req,res)=>{
    res.status(200).json({res:'lista de usuarios registrados'})
}

const detalleUsuario = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const usuarioBDD = await usuario.findById(id).select("-password")
    if(!usuarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el usuario ${id}`})
    res.status(200).json({msg:usuarioBDD})
}
const actualizarPassword = async (req,res)=>{
    const usuarioBDD = await usuario.findById(req.usuarioBDD._id)
    if(!usuarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el usuario ${id}`})
    const verificarPassword = await usuarioBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    usuarioBDD.password = await usuarioBDD.encrypPassword(req.body.passwordnuevo)
    await usuarioBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}

export {
    login,
    perfil,
    registro,
    listarUsuarios,
    detalleUsuario,
    actualizarPassword,
}