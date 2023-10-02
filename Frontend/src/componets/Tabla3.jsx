import { useEffect, useState } from "react";
import { MdDeleteForever, MdNoteAdd, MdInfo } from "react-icons/md";
import axios from "axios";
import Mensaje from "./Alertas/Mensaje";
import { useNavigate } from "react-router-dom";

const Tabla3 = () => {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [reservasFiltradas, setReservasFiltradas] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const reservesPerPage = 10; // Cantidad de reservas por página

  const indexOfLastReserve = (currentPage + 1) * reservesPerPage;
  const indexOfFirstReserve = indexOfLastReserve - reservesPerPage;
  const currentReserves = reservas.slice(
    indexOfFirstReserve,
    indexOfLastReserve
  );

  const pageCount = Math.ceil(reservas.length / reservesPerPage);

  const buscarReservas = () => {
    const resultados = reservas.filter((reserva) =>
      reserva.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );
    setReservasFiltradas(resultados);
  };

  const listarReservas = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/reservas`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      const reservasData = respuesta.data;

      setReservas(reservasData);

      // Si hay un término de búsqueda, filtrar la lista de reservas
      if (busqueda !== "") {
        const filteredReservas = reservasData.filter((reserva) =>
          reserva.descripcion.toLowerCase().includes(busqueda.toLowerCase())
        );
        setReservasFiltradas(filteredReservas);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmar = confirm(
        "Vas a eliminar una reserva, ¿Estás seguro de realizar esta acción?"
      );
      if (confirmar) {
        const token = localStorage.getItem("token");
        const url = `${
          import.meta.env.VITE_BACKEND_URL
        }/reserva/eliminar/${id}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Reserva eliminada",
          showConfirmButton: false,
          timer: 2000,
        });

        await axios.delete(url, { headers });
        listarReservas();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    listarReservas();
  }, [busqueda]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Buscar reserva..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {busqueda === "" ? (
        currentReserves.length === 0 ? (
          <Mensaje tipo={"active"}>{"No existen registros"}</Mensaje>
        ) : (
          <div>
            <table className="w-full mt-5 table-auto shadow-lg bg-white">
              <thead className="bg-gray-800 text-slate-400">
                <tr>
                  <th className="p-2">N°</th>
                  <th className="p-2">Descripción</th>
                  <th className="p-2">Conferencista</th>
                  <th className="p-2">Auditorio</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentReserves.map((reserva, index) => (
                  <tr
                    className="border-b hover:bg-gray-300 text-center"
                    key={reserva._id}
                  >
                    <td>{index + 1}</td>
                    <td>{reserva.descripcion}</td>
                    <td>{reserva.conferencistas.nombre}</td>
                    <td>{reserva.auditorios.nombre}</td>
                    <td className="py-2 text-center">
                      <MdNoteAdd
                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                        onClick={() =>
                          navigate(`/dashboard/visualizar/${reserva._id}`)
                        }
                      />

                      <MdInfo
                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                        onClick={() =>
                          navigate(`/dashboard/actualizar/${reserva._id}`)
                        }
                      />

                      <MdDeleteForever
                        className="h-7 w-7 text-red-900 cursor-pointer inline-block"
                        onClick={() => {
                          handleDelete(reserva._id);
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
        reservasFiltradas.length === 0 ? (
          <Mensaje tipo={"active"}>{"No se encontraron resultados"}</Mensaje>
        ) : (
          <table className="w-full mt-5 table-auto shadow-lg bg-white">
            <thead className="bg-gray-800 text-slate-400">
              <tr>
                <th className="p-2">N°</th>
                <th className="p-2">Descripción</th>
                <th className="p-2">Conferencista</th>
                <th className="p-2">Auditorio</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((reserva, index) => (
                <tr
                  className="border-b hover:bg-gray-300 text-center"
                  key={reserva._id}
                >
                  <td>{index + 1}</td>
                  <td>{reserva.descripcion}</td>
                  <td>{reserva.conferencistas.nombre}</td>
                  <td>{reserva.auditorios.nombre}</td>
                  <td className="py-2 text-center">
                    <MdNoteAdd
                      className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                      onClick={() =>
                        navigate(`/dashboard/visualizar/${reserva._id}`)
                      }
                    />

                    <MdInfo
                      className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                      onClick={() =>
                        navigate(`/dashboard/actualizar/${reserva._id}`)
                      }
                    />

                    <MdDeleteForever
                      className="h-7 w-7 text-red-900 cursor-pointer inline-block"
                      onClick={() => {
                        handleDelete(reserva._id);
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

export default Tabla3;
