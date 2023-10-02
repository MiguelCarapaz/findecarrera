import Auditorio from '../models/auditorios.js';
import mongoose from 'mongoose';

const listarAuditorios = async (req, res) => {
  try {
    const auditorios = await Auditorio.find({});
    res.status(200).json(auditorios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const detalleAuditorio = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe el auditorio ${id}` });

    const auditorio = await Auditorio.findById(id);
    if (!auditorio) {
      return res.status(404).json({ msg: `Lo sentimos, no existe el auditorio ${id}` });
    }

    res.status(200).json(auditorio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const registrarAuditorio = async (req, res) => {
  try {
    if (Object.values(req.body).includes(''))
      return res.status(400).json({ msg: 'Lo sentimos, debes llenar todos los campos' });

    const nuevoAuditorio = new Auditorio(req.body);
    await nuevoAuditorio.save();
    res.status(200).json({ msg: 'Registro exitoso del auditorio' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const actualizarAuditorio = async (req, res) => {
  const { id } = req.params;
  try {
    if (Object.values(req.body).includes(''))
      return res.status(400).json({ msg: 'Lo sentimos, debes llenar todos los campos' });

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe el auditorio ${id}` });

    await Auditorio.findByIdAndUpdate(id, req.body);
    res.status(200).json({ msg: 'Actualización exitosa del auditorio' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const eliminarAuditorio = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe el auditorio ${id}` });

    await Auditorio.findByIdAndRemove(id);
    res.status(200).json({ msg: 'Auditorio eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export {
  listarAuditorios,
  detalleAuditorio,
  registrarAuditorio,
  actualizarAuditorio,
  eliminarAuditorio,
};
