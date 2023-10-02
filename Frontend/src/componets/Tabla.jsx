import { useEffect, useState } from "react";
import axios from "axios";
import Mensaje from "./Alertas/Mensaje";
import { useNavigate } from "react-router-dom";

const Tabla = () => {
  const [auditorios, setAuditorios] = useState([]);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const [auditoriosFiltrados, setAuditoriosFiltrados] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const auditoriosPerPage = 10; // Cantidad de auditorios por página

  const indexOfLastAuditorio = (currentPage + 1) * auditoriosPerPage;
  const indexOfFirstAuditorio = indexOfLastAuditorio - auditoriosPerPage;
  const currentAuditorios = auditorios.slice(
    indexOfFirstAuditorio,
    indexOfLastAuditorio
  );

  const pageCount = Math.ceil(auditorios.length / auditoriosPerPage);

  const buscarAuditorios = () => {
    const resultados = auditorios.filter((auditorio) =>
      auditorio.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setAuditoriosFiltrados(resultados);
  };

  const listarAuditorios = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/auditorios`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      const auditoriosData = respuesta.data;

      setAuditorios(auditoriosData);

      // Si hay un término de búsqueda, filtrar la lista de auditorios
      if (busqueda !== "") {
        const filteredAuditorios = auditoriosData.filter((auditorio) =>
          auditorio.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );
        setAuditoriosFiltrados(filteredAuditorios);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEliminarAuditorio = async (id) => {
    try {
      const confirmar = window.confirm(
        "Vas a eliminar un auditorio, ¿Estás seguro de realizar esta acción?"
      );
      if (confirmar) {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_BACKEND_URL}/auditorio/eliminar/${id}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        // Puedes enviar cualquier dato adicional necesario aquí
        const data = {};
        await axios.delete(url, { headers, data });
        listarAuditorios();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    listarAuditorios();
  }, [busqueda]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Buscar auditorio..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {busqueda === "" ? (
        currentAuditorios.length === 0 ? (
          <Mensaje tipo={"active"}>{"No existen registros"}</Mensaje>
        ) : (
          <div>
            <table className="w-full mt-5 table-auto shadow-lg bg-white">
              <thead className="bg-gray-800 text-slate-400">
                <tr>
                  <th className="p-2">N°</th>
                  <th className="p-2">Código</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Ubicación</th>
                  <th className="p-2">Capacidad</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentAuditorios.map((auditorio, index) => (
                  <tr
                    className="border-b hover:bg-gray-300 text-center"
                    key={auditorio._id}
                  >
                    <td>{index + 1}</td>
                    <td>{auditorio.codigo}</td>
                    <td>{auditorio.nombre}</td>
                    <td>{auditorio.ubicacion}</td>
                    <td>{auditorio.capacidad}</td>
                    <td className="py-2 text-center">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() =>
                          navigate(`/dashboard/visualizar/${auditorio._id}`)
                        }
                      >
                        Ver
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 mr-2"
                        onClick={() =>
                          navigate(`/dashboard/actualizar/${auditorio._id}`)
                        }
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          handleEliminarAuditorio(auditorio._id);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pageCount > 1 && (
              <div className="pagination">
                {Array.from({ length: pageCount }, (_, index) => (
                  <span
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={`pagination-item ${
                      index === currentPage ? "active" : ""
                    }`}
                  >
                    Página {index + 1}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      ) : (
        // Mostrar los resultados de la búsqueda
        auditoriosFiltrados.length === 0 ? (
          <Mensaje tipo={"active"}>{"No se encontraron resultados"}</Mensaje>
        ) : (
          <table className="w-full mt-5 table-auto shadow-lg bg-white">
            <thead className="bg-gray-800 text-slate-400">
              <tr>
                <th className="p-2">N°</th>
                <th className="p-2">Código</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Ubicación</th>
                <th className="p-2">Capacidad</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {auditoriosFiltrados.map((auditorio, index) => (
                <tr
                  className="border-b hover:bg-gray-300 text-center"
                  key={auditorio._id}
                >
                  <td>{index + 1}</td>
                  <td>{auditorio.codigo}</td>
                  <td>{auditorio.nombre}</td>
                  <td>{auditorio.ubicacion}</td>
                  <td>{auditorio.capacidad}</td>
                  <td className="py-2 text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() =>
                        navigate(`/dashboard/visualizar/${auditorio._id}`)
                      }
                    >
                      Ver
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 mr-2"
                      onClick={() =>
                        navigate(`/dashboard/actualizar/${auditorio._id}`)
                      }
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        handleEliminarAuditorio(auditorio._id);
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </>
  );
};

export default Tabla;
