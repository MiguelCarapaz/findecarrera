import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./layout/Auth";
import Login from "./paginas/Login";
import { Register } from "./paginas/Register";
import { NotFound } from "./paginas/NotFound";
import Dashboard from "./layout/Dashboard";
import Listar from "./paginas/Listar";
import Visualizar from "./paginas/Visualizar";
import Auditorio from "./paginas/Auditorio";
import Conferencistas from "./paginas/Conferencistas"; // Importa el componente de Conferencistas
import Reservas from "./paginas/Reservas"; // Importa el componente de Reservas
import Actualizar from "./paginas/Actualizar";
import Perfil from "./paginas/Perfil";
import { AuthProvider } from "./context/AuthProvider";
import { PrivateRoute } from "./routes/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index element={<Login />} />

          <Route path="/" element={<Auth />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Routes>
                  <Route element={<Dashboard />}>
                    <Route index element={<Perfil />} />
                    <Route path="listar" element={<Listar />} />
                    <Route path="visualizar/:id" element={<Visualizar />} />
                    <Route path="Auditorio" element={<Auditorio />} />
                    <Route path="Conferencistas" element={<Conferencistas />} /> 
                    <Route path="Reservas" element={<Reservas />} /> 
                    <Route path="actualizar/:id" element={<Actualizar />} />
                  </Route> 
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
