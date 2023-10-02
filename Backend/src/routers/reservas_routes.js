import { Router } from 'express';
import {
  actualizarReserva,
  detalleReserva,
  eliminarReserva,
  listarReserva,
  registrarReserva,
} from '../controllers/reservas_controller.js';
import verificarAutenticacion from '../middlewares/autenticacion.js';

const router = Router();

router.get('/reservas', verificarAutenticacion, listarReserva);
router.get('/reserva/:id', verificarAutenticacion, detalleReserva);
router.post('/reserva/registro', verificarAutenticacion, registrarReserva);
router.put('/reserva/actualizar/:id', verificarAutenticacion, actualizarReserva);
router.delete('/reserva/eliminar/:id', verificarAutenticacion, eliminarReserva);

export default router;
