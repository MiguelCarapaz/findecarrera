// conferencistas_controller.js
import Conferencista from '../models/conferencistas.js';
import mongoose from 'mongoose';

// Controladores para conferencistas
const listarConferencistas = async (req, res) => {
  try {
    const conferencistas = await Conferencista.find({});
    res.status(200).json(conferencistas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const detalleConferencista = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe el conferencista ${id}` });

    const conferencista = await Conferencista.findById(id);
    if (!conferencista) {
      return res.status(404).json({ msg: `Lo sentimos, no existe el conferencista ${id}` });
    }

    res.status(200).json(conferencista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const registrarConferencista = async (req, res) => {
  try {
    if (Object.values(req.body).includes(''))
      return res.status(400).json({ msg: 'Lo sentimos, debes llenar todos los campos' });

    const nuevoConferencista = new Conferencista(req.body);
    await nuevoConferencista.save();
    res.status(200).json({ msg: 'Registro exitoso del conferencista' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const actualizarConferencista = async (req, res) => {
  const { id } = req.params;
  try {
    if (Object.values(req.body).includes(''))
      return res.status(400).json({ msg: 'Lo sentimos, debes llenar todos los campos' });

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe el conferencista ${id}` });

    await Conferencista.findByIdAndUpdate(id, req.body);
    res.status(200).json({ msg: 'Actualización exitosa del conferencista' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const eliminarConferencista = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe el conferencista ${id}` });

    await Conferencista.findByIdAndRemove(id);
    res.status(200).json({ msg: 'Conferencista eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export {
  listarConferencistas,
  detalleConferencista,
  registrarConferencista,
  actualizarConferencista,
  eliminarConferencista,
};
