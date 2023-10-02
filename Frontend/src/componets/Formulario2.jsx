import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import axios from 'axios';
import Mensaje from './Alertas/Mensaje';
import Swal from "sweetalert2";

export const Formulario2 = ({ conferencista }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const charLimit = 50;

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required('Campo obligatorio')
      .max(charLimit, `El nombre no puede tener más de ${charLimit} caracteres`),
    apellido: Yup.string()
      .required('Campo obligatorio')
      .max(charLimit, `El apellido no puede tener más de ${charLimit} caracteres`),
    cedula: Yup.number()
      .required('Campo obligatorio')
      .integer('La cédula debe ser un número entero')
      .positive('La cédula debe ser un número positivo'),
    genero: Yup.string()
      .required('Campo obligatorio')
      .max(charLimit, `El género no puede tener más de ${charLimit} caracteres`),
    ciudad: Yup.string()
      .required('Campo obligatorio')
      .max(charLimit, `La ciudad no puede tener más de ${charLimit} caracteres`),
    direccion: Yup.string()
      .required('Campo obligatorio')
      .max(charLimit, `La dirección no puede tener más de ${charLimit} caracteres`),
    fecha_nacimiento: Yup.date().required('Campo obligatorio'),
    telefono: Yup.number()
      .required('Campo obligatorio')
      .integer('El teléfono debe ser un número entero')
      .positive('El teléfono debe ser un número positivo'),
    email: Yup.string()
      .required('Campo obligatorio')
      .email('Ingrese un correo válido')
      .max(charLimit, `El correo no puede tener más de ${charLimit} caracteres`),
    empresa: Yup.string()
      .required('Campo obligatorio')
      .max(charLimit, `La empresa no puede tener más de ${charLimit} caracteres`),
  });

  return (
    <Formik
      initialValues={{
        nombre: conferencista?.nombre || '',
        apellido: conferencista?.apellido || '',
        cedula: conferencista?.cedula || '',
        genero: conferencista?.genero || '',
        ciudad: conferencista?.ciudad || '',
        direccion: conferencista?.direccion || '',
        fecha_nacimiento: conferencista?.fecha_nacimiento || '',
        telefono: conferencista?.telefono || '',
        email: conferencista?.email || '',
        empresa: conferencista?.empresa || '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          const token = localStorage.getItem('token');
          values.usuario = auth._id;

          if (conferencista?._id) {
            const url = `${import.meta.env.VITE_BACKEND_URL}/conferencistas/actualizar/${conferencista?._id}`;
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
              title: 'Conferencista actualizado',
              showConfirmButton: false,
              timer: 2000,
            });

            await axios.put(url, values, options);
          } else {
            const url = `${import.meta.env.VITE_BACKEND_URL}/conferencistas/registro`;
            const options = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            };

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Conferencista registrado',
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
              htmlFor="nombre"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Nombre:{' '}
            </label>
            <Field
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre"
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
              htmlFor="apellido"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Apellido:{' '}
            </label>
            <Field
              type="text"
              id="apellido"
              name="apellido"
              placeholder="Apellido"
              maxLength={charLimit}
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.apellido && touched.apellido ? 'border-red-500' : ''
              }`}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {charLimit - values.apellido.length}
            </div>
            <ErrorMessage
              name="apellido"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="cedula"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Cédula:{' '}
            </label>
            <Field
              type="number"
              id="cedula"
              name="cedula"
              placeholder="Cédula"
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.cedula && touched.cedula ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage
              name="cedula"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="genero"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Género:{' '}
            </label>
            <Field
              type="text"
              id="genero"
              name="genero"
              placeholder="Género"
              maxLength={charLimit}
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.genero && touched.genero ? 'border-red-500' : ''
              }`}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {charLimit - values.genero.length}
            </div>
            <ErrorMessage
              name="genero"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="ciudad"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Ciudad:{' '}
            </label>
            <Field
              type="text"
              id="ciudad"
              name="ciudad"
              placeholder="Ciudad"
              maxLength={charLimit}
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.ciudad && touched.ciudad ? 'border-red-500' : ''
              }`}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {charLimit - values.ciudad.length}
            </div>
            <ErrorMessage
              name="ciudad"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="direccion"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Dirección:{' '}
            </label>
            <Field
              type="text"
              id="direccion"
              name="direccion"
              placeholder="Dirección"
              maxLength={charLimit}
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.direccion && touched.direccion ? 'border-red-500' : ''
              }`}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {charLimit - values.direccion.length}
            </div>
            <ErrorMessage
              name="direccion"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="fecha_nacimiento"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Fecha de Nacimiento:{' '}
            </label>
            <Field
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              placeholder="Fecha de Nacimiento"
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.fecha_nacimiento && touched.fecha_nacimiento
                  ? 'border-red-500'
                  : ''
              }`}
            />
            <ErrorMessage
              name="fecha_nacimiento"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="telefono"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Teléfono:{' '}
            </label>
            <Field
              type="number"
              id="telefono"
              name="telefono"
              placeholder="Teléfono"
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.telefono && touched.telefono ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage
              name="telefono"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Correo:{' '}
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="Correo"
              maxLength={charLimit}
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.email && touched.email ? 'border-red-500' : ''
              }`}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {charLimit - values.email.length}
            </div>
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="empresa"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Empresa:{' '}
            </label>
            <Field
              type="text"
              id="empresa"
              name="empresa"
              placeholder="Empresa"
              maxLength={charLimit}
              className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 ${
                errors.empresa && touched.empresa ? 'border-red-500' : ''
              }`}
            />
            <div className="text-gray-500 text-sm mb-2">
              Caracteres restantes: {charLimit - values.empresa.length}
            </div>
            <ErrorMessage
              name="empresa"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-600 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all"
            disabled={isSubmitting}
          >
            {conferencista?._id ? 'Actualizar conferencista' : 'Registrar conferencista'}
          </button>
        </form>
      )}
    </Formik>
  );
};
