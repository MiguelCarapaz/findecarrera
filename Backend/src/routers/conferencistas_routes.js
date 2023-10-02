import { Router } from 'express';
import {
  listarConferencistas,
  detalleConferencista,
  registrarConferencista,
  actualizarConferencista,
  eliminarConferencista,
} from '../controllers/conferencistas_controller.js';
import verificarAutenticacion from '../middlewares/autenticacion.js';

const router = Router();

router.get('/conferencistas', verificarAutenticacion, listarConferencistas);
router.get('/conferencista/:id', verificarAutenticacion, detalleConferencista);
router.post('/conferencista/registro', verificarAutenticacion, registrarConferencista);
router.put('/conferencista/actualizar/:id', verificarAutenticacion, actualizarConferencista);
router.delete('/conferencista/eliminar/:id', verificarAutenticacion, eliminarConferencista);

export default router;
