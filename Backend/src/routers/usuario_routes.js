import {Router} from 'express';
import {
    login,
    perfil,
    registro,
    listarUsuarios,
    detalleUsuario,
    actualizarPassword,
} from "../controllers/usuario_controller.js";
import verificarAutenticacion from '../middlewares/autenticacion.js'

const router = Router()

router.post("/login", login)
router.post("/registro", registro)
router.get("/usuarios", listarUsuarios)

router.get("/perfil",verificarAutenticacion, perfil)
router.put('/usuario/actualizarpassword',verificarAutenticacion,actualizarPassword)
router.get("/usuario/:id",verificarAutenticacion, detalleUsuario)

export default router;