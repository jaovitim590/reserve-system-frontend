import { Home } from "./pages/Home";
import { Quartos } from "./pages/Quartos";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Perfil } from "./pages/Perfil";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { QuartoReserva } from "./pages/Reservar";
import { MinhasReservas } from "./pages/MyReservas";
import { Contato } from "./pages/Contato";
import { createBrowserRouter } from "react-router-dom";
import { DashBoard } from "./components/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {index: true,Component: Home,},
      {path: "quartos",Component: Quartos},
      {path: "register",Component: Register,},
      {path: "login",Component: Login,},
      {path: "contato", Component: Contato},
      {
        Component: ProtectedRoute,
        children: [
          { path: "perfil", Component: Perfil },
          { path: "quartos/:id/reservar", Component: QuartoReserva },
          {path: "reservas", Component:MinhasReservas},
          {path: "dashboard", Component:DashBoard}
        ]
      }
    ]
  }
]);
