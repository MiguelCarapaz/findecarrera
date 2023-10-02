import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routerUsuario from './routers/usuario_routes.js'
import routerAuditorios from './routers/auditorios_routes.js'
import routerConferencistas from './routers/conferencistas_routes.js'
import routerReservas from './routers/reservas_routes.js'

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales


// Rutas 
app.use('/api',routerUsuario)
app.use('/api',routerReservas)
app.use('/api',routerConferencistas)
app.use('/api',routerAuditorios)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default  app