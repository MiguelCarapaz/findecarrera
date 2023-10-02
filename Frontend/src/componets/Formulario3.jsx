import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import axios from 'axios';
import Mensaje from './Alertas/Mensaje';
import Swal from "sweetalert2";

export const Formulario3 = ({ reserva }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const charLimit = 500;

  const validationSchema = Yup.object().shape({
    codigo: Yup.number()
      .required('Campo obligatorio')
      .integer('El código debe ser un número entero')
      .positive('El código debe ser un número positivo'),
    descripcion: Yup.string()
      .max(charLimit, `La descripción no puede tener más de ${charLimit} caracteres`),
    id_conferencista: Yup.number()
      .required('Campo obligatorio')
      .integer('El ID del conferencista debe ser un número entero')
      .positive('El ID del conferencista debe ser un número positivo'),
    id_auditorio: Yup.number()
      .required('Campo obligatorio')
      .integer('El ID del auditorio debe ser un número entero')
      .positive('El ID del auditorio debe ser un número positivo'),
  });

  return (
    <Formik
      initialValues={{
        codigo: reserva?.codigo || '',
        descripcion: reserva?.descripcion || '',
        id_conferencista: reserva?.id_conferencista || '',
        id_auditorio: reserva?.id_auditorio || '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          const token = localStorage.getItem('token');
          values.usuario = auth._id;

          if (reserva?._id) {
            const url = `${import.meta.env.VITE_BACKEND_URL}/reserva/actualizar/${reserva?._id}`;
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
              title: 'Reserva actualizada',
              showConfirmButton: false,
              timer: 2000,
            });

            await axios.put(url, values, options);
          } else {
            const url = `${import.meta.env.VITE_BACKEND_URL}/reserva/registro`;
            const options = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            };

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Reserva registrada',
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
              Código de la reserva:{' '}
            </label>
            <Field
              type="number"
              id="codigo"
              name="codigo"
              placeholder="Código de la reserva"
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.codigo && touched.codigo ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage
              name="codigo"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="descripcion"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Descripción de la reserva:{' '}
            </label>
            <textarea
              id="descripcion"  
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="Ingrese la descripción de la reserva"
              name="descripcion"
              value={values.descripcion}
              onChange={(event) => {
                const descripcion = event.target.value;
                if (descripcion.length <= charLimit) {
                  setFieldValue('descripcion', descripcion);
                }
              }}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {charLimit - values.descripcion.length}
            </div>
            <ErrorMessage
              name="descripcion"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="id_conferencista"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              ID del conferencista:{' '}
            </label>
            <Field
              type="number"
              id="id_conferencista"
              name="id_conferencista"
              placeholder="ID del conferencista"
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.id_conferencista && touched.id_conferencista ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage
              name="id_conferencista"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="id_auditorio"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              ID del auditorio:{' '}
            </label>
            <Field
              type="number"
              id="id_auditorio"
              name="id_auditorio"
              placeholder="ID del auditorio"
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.id_auditorio && touched.id_auditorio ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage
              name="id_auditorio"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-600 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all"
            disabled={isSubmitting}
          >
            {reserva?._id ? 'Actualizar reserva' : 'Registrar reserva'}
          </button>
        </form>
      )}
    </Formik>
  );
};
