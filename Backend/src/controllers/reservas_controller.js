import Reservas from "../models/reservas.js";
import mongoose from "mongoose";

const listarReserva = async (req, res) => {
  try {
    const reservas = await Reservas.find({ estado: true })
      .select("-salida -createdAt -updatedAt -__v")
      .populate('conferencistas', 'nombre apellido')
      .populate('auditorios', 'nombre ubicacion');
    res.status(200).json(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const detalleReserva = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe la reserva ${id}` });

    const reserva = await Reservas.findById(id)
      .select("-createdAt -updatedAt -__v")
      .populate('conferencistas', 'nombre apellido')
      .populate('auditorios', 'nombre ubicacion');

    if (!reserva) {
      return res.status(404).json({ msg: `Lo sentimos, no existe la reserva ${id}` });
    }

    res.status(200).json(reserva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const registrarReserva = async (req, res) => {
  try {
    if (!req.body.conferencistas || !req.body.auditorios) {
      return res.status(400).json({ msg: "Lo sentimos, debes asignar conferencistas y auditorios" });
    }

    const nuevaReserva = new Reservas(req.body);
    await nuevaReserva.save();
    res.status(200).json({ msg: "Registro exitoso de la reserva" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const actualizarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.body.conferencistas || !req.body.auditorios) {
      return res.status(400).json({ msg: "Lo sentimos, debes asignar conferencistas y auditorios" });
    }

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe la reserva ${id}` });

    await Reservas.findByIdAndUpdate(id, req.body);
    res.status(200).json({ msg: "Actualización exitosa de la reserva" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const eliminarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe la reserva ${id}` });

    await Reservas.findByIdAndRemove(id);
    res.status(200).json({ msg: "Reserva eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export {
  listarReserva,
  detalleReserva,
  registrarReserva,
  actualizarReserva,
  eliminarReserva
};
