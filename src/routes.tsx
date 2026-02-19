import { Home } from "./pages/Home";
import { Quartos } from "./pages/Quartos";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Perfil } from "./pages/Perfil";
import { Layout } from "./components/Layout";
import { createBrowserRouter } from "react-router-dom";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "quartos",
        Component: Quartos 
      },
      {
        path: "login",
        Component: Login
      },
      {
        path: "register",
        Component: Register
      },
      {
        path: "perfil",
        Component: Perfil
      }
    ]
  }
])