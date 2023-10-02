import { useEffect, useState } from "react";
import { MdDeleteForever, MdNoteAdd, MdInfo } from "react-icons/md";
import axios from "axios";
import Mensaje from "./Alertas/Mensaje";
import { useNavigate } from "react-router-dom";

const Tabla2 = () => {
  const [conferencistas, setConferencistas] = useState([]);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const [conferencistasFiltrados, setConferencistasFiltrados] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const conferencistasPerPage = 10; // Cantidad de conferencistas por página

  const indexOfLastConferencista = (currentPage + 1) * conferencistasPerPage;
  const indexOfFirstConferencista = indexOfLastConferencista - conferencistasPerPage;
  const currentConferencistas = conferencistas.slice(
    indexOfFirstConferencista,
    indexOfLastConferencista
  );

  const pageCount = Math.ceil(conferencistas.length / conferencistasPerPage);

  const buscarConferencistas = () => {
    const resultados = conferencistas.filter((conferencista) =>
      `${conferencista.nombre} ${conferencista.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
    );
    setConferencistasFiltrados(resultados);
  };

  const listarConferencistas = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/conferencistas`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      const conferencistasData = respuesta.data;

      setConferencistas(conferencistasData);

      // Si hay un término de búsqueda, filtrar la lista de conferencistas
      if (busqueda !== "") {
        const filteredConferencistas = conferencistasData.filter((conferencista) =>
          `${conferencista.nombre} ${conferencista.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
        );
        setConferencistasFiltrados(filteredConferencistas);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmar = confirm(
        "Vas a eliminar un conferencista, ¿Estás seguro de realizar esta acción?"
      );
      if (confirmar) {
        const token = localStorage.getItem("token");
        const url = `${
          import.meta.env.VITE_BACKEND_URL
        }/conferencista/eliminar/${id}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Conferencista eliminado",
          showConfirmButton: false,
          timer: 2000,
        });
        
        await axios.delete(url, { headers });
        listarConferencistas();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    listarConferencistas();
  }, [busqueda]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Buscar conferencista..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {busqueda === "" ? (
        currentConferencistas.length === 0 ? (
          <Mensaje tipo={"active"}>{"No existen registros"}</Mensaje>
        ) : (
          <div>
            <table className="w-full mt-5 table-auto shadow-lg bg-white">
              <thead className="bg-gray-800 text-slate-400">
                <tr>
                  <th className="p-2">N°</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Apellido</th>
                  <th className="p-2">Cédula</th>
                  <th className="p-2">Género</th>
                  <th className="p-2">Ciudad</th>
                  <th className="p-2">Dirección</th>
                  <th className="p-2">Fecha de Nacimiento</th>
                  <th className="p-2">Teléfono</th>
                  <th className="p-2">Correo</th>
                  <th className="p-2">Empresa</th>
                </tr>
              </thead>
              <tbody>
                {currentConferencistas.map((conferencista, index) => (
                  <tr
                    className="border-b hover:bg-gray-300 text-center"
                    key={conferencista._id}
                  >
                    <td>{index + 1}</td>
                    <td>{conferencista.nombre}</td>
                    <td>{conferencista.apellido}</td>
                    <td>{conferencista.cedula}</td>
                    <td>{conferencista.genero}</td>
                    <td>{conferencista.ciudad}</td>
                    <td>{conferencista.direccion}</td>
                    <td>{new Date(conferencista.fecha_nacimiento).toLocaleDateString()}</td>
                    <td>{conferencista.telefono}</td>
                    <td>{conferencista.email}</td>
                    <td>{conferencista.empresa}</td>
                    <td className="py-2 text-center">
                      <MdNoteAdd
                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                        onClick={() =>
                          navigate(`/dashboard/visualizar/${conferencista._id}`)
                        }
                      />

                      <MdInfo
                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                        onClick={() =>
                          navigate(`/dashboard/actualizar/${conferencista._id}`)
                        }
                      />

                      <MdDeleteForever
                        className="h-7 w-7 text-red-900 cursor-pointer inline-block"
                        onClick={() => {
                          handleDelete(conferencista._id);
                        }}
                      />
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
        conferencistasFiltrados.length === 0 ? (
          <Mensaje tipo={"active"}>{"No se encontraron resultados"}</Mensaje>
        ) : (
          <table className="w-full mt-5 table-auto shadow-lg bg-white">
            <thead className="bg-gray-800 text-slate-400">
              <tr>
                <th className="p-2">N°</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Apellido</th>
                <th className="p-2">Cédula</th>
                <th className="p-2">Género</th>
                <th className="p-2">Ciudad</th>
                <th className="p-2">Dirección</th>
                <th className="p-2">Fecha de Nacimiento</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Correo</th>
                <th className="p-2">Empresa</th>
              </tr>
            </thead>
            <tbody>
              {conferencistasFiltrados.map((conferencista, index) => (
                <tr
                  className="border-b hover:bg-gray-300 text-center"
                  key={conferencista._id}
                >
                  <td>{index + 1}</td>
                  <td>{conferencista.nombre}</td>
                  <td>{conferencista.apellido}</td>
                  <td>{conferencista.cedula}</td>
                  <td>{conferencista.genero}</td>
                  <td>{conferencista.ciudad}</td>
                  <td>{conferencista.direccion}</td>
                  <td>{new Date(conferencista.fecha_nacimiento).toLocaleDateString()}</td>
                  <td>{conferencista.telefono}</td>
                  <td>{conferencista.email}</td>
                  <td>{conferencista.empresa}</td>
                  <td className="py-2 text-center">
                    <MdNoteAdd
                      className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                      onClick={() =>
                        navigate(`/dashboard/visualizar/${conferencista._id}`)
                      }
                    />

                    <MdInfo
                      className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                      onClick={() =>
                        navigate(`/dashboard/actualizar/${conferencista._id}`)
                      }
                    />

                    <MdDeleteForever
                      className="h-7 w-7 text-red-900 cursor-pointer inline-block"
                      onClick={() => {
                        handleDelete(conferencista._id);
                      }}
                    />
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

export default Tabla2;
