import { Formulario2 } from "../componets/Formulario2"; // Importa el componente de formulario para conferencistas
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Mensaje from "../componets/Alertas/Mensaje";
import axios from "axios";

const Actualizar = () => {
  const { id } = useParams();
  const [conferencista, setConferencista] = useState({});
  const [mensaje, setMensaje] = useState({});

  useEffect(() => {
    const consultarConferencista = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_BACKEND_URL}/conferencistas/${id}`; // Actualiza la URL para conferencistas
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const respuesta = await axios.get(url, options);
        setConferencista(respuesta.data);
      } catch (error) {
        setMensaje({ respuesta: error.response.data.msg, tipo: false });
      }
    };
    consultarConferencista();
  }, [id]); // Asegúrate de incluir [id] como dependencia para que se actualice cuando cambie el ID.

  return (
    <div>
      <h1 className="font-black text-4xl text-gray-500">Actualizar Conferencista</h1>
      <hr className="my-4" />
      <p className="mb-8">
      </p>
      {Object.keys(conferencista).length !== 0 ? ( // Cambia la condición para verificar si conferencista no está vacío
        <Formulario2 conferencista={conferencista} /> // Utiliza el componente de formulario para conferencistas
      ) : (
        Object.keys(mensaje).length > 0 && (
          <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
        )
      )}
    </div>
  );
};

export default Actualizar;
