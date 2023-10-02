import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import axios from 'axios';
import Mensaje from './Alertas/Mensaje';
import Swal from "sweetalert2";

export const Formulario = ({ auditorio }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const charLimit = 50;

  const validationSchema = Yup.object().shape({
    codigo: Yup.string()
      .required('Campo obligatorio')
      .max(charLimit, `El código no puede tener más de ${charLimit} caracteres`),
    nombre: Yup.string()
      .required('Campo obligatorio')
      .max(charLimit, `El nombre no puede tener más de ${charLimit} caracteres`),
    ubicacion: Yup.string()
      .required('Campo obligatorio')
      .max(charLimit, `La ubicación no puede tener más de ${charLimit} caracteres`),
    capacidad: Yup.number()
      .required('Campo obligatorio')
      .integer('La capacidad debe ser un número entero')
      .positive('La capacidad debe ser un número positivo'),
    descripcion: Yup.string()
      .max(500, 'La descripción no puede tener más de 500 caracteres'),
  });

  return (
    <Formik
      initialValues={{
        codigo: auditorio?.codigo || '',
        nombre: auditorio?.nombre || '',
        ubicacion: auditorio?.ubicacion || '',
        capacidad: auditorio?.capacidad || '',
        descripcion: auditorio?.descripcion || '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          const token = localStorage.getItem('token');
          values.usuario = auth._id;

          if (auditorio?._id) {
            const url = `${import.meta.env.VITE_BACKEND_URL}/auditorio/actualizar/${auditorio?._id}`;
            const options = {
              headers: {
                method: 'PUT',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            };

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Auditorio actualizado',
              showConfirmButton: false,
              timer: 2000,
            });

            await axios.put(url, values, options);
          } else {
            const url = `${import.meta.env.VITE_BACKEND_URL}/auditorio/registro`;
            const options = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            };

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Auditorio registrado',
              showConfirmButton: false,
              timer: 2000,
            });

            await axios.post(url, values, options);
          }

          // Navegar a la página de listado después de registrar o actualizar
          navigate('/dashboard/listar');
        } catch (error) {
          setMensaje({ respuesta: error.response.data.msg, tipo: false });
          setTimeout(() => {
            setMensaje({});
          }, 3000);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, errors, touched, values }) => (
        <form onSubmit={handleSubmit}>
          {Object.keys(mensaje).length > 0 && (
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          )}
          <div>
            <label
              htmlFor="codigo"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Código del auditorio:{' '}
            </label>
            <Field
              type="text"
              id="codigo"
              name="codigo"
              placeholder="Código del auditorio"
              maxLength={charLimit}
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.codigo && touched.codigo ? 'border-red-500' : ''
              }`}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {charLimit - values.codigo.length}
            </div>
            <ErrorMessage
              name="codigo"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="nombre"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Nombre del auditorio:{' '}
            </label>
            <Field
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre del auditorio"
              maxLength={charLimit}
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.nombre && touched.nombre ? 'border-red-500' : ''
              }`}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {charLimit - values.nombre.length}
            </div>
            <ErrorMessage
              name="nombre"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="ubicacion"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Ubicación del auditorio:{' '}
            </label>
            <Field
              type="text"
              id="ubicacion"
              name="ubicacion"
              placeholder="Ubicación del auditorio"
              maxLength={charLimit}
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.ubicacion && touched.ubicacion ? 'border-red-500' : ''
              }`}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {charLimit - values.ubicacion.length}
            </div>
            <ErrorMessage
              name="ubicacion"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="capacidad"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Capacidad del auditorio:{' '}
            </label>
            <Field
              type="number"
              id="capacidad"
              name="capacidad"
              placeholder="Capacidad del auditorio"
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.capacidad && touched.capacidad ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage
              name="capacidad"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="descripcion"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Descripción del auditorio:{' '}
            </label>
            <textarea
              id="descripcion"  
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="Ingrese la descripción del auditorio"
              name="descripcion"
              value={values.descripcion}
              onChange={(event) => {
                const descripcion = event.target.value;
                if (descripcion.length <= 500) {
                  setFieldValue('descripcion', descripcion);
                }
              }}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {500 - values.descripcion.length}
            </div>
            <ErrorMessage
              name="descripcion"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-600 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all"
            disabled={isSubmitting}
          >
            {auditorio?._id ? 'Actualizar auditorio' : 'Registrar auditorio'}
          </button>
        </form>
      )}
    </Formik>
  );
};
