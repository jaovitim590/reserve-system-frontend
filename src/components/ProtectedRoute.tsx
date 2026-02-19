import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { CircularProgress, Box } from "@mui/material"

export const ProtectedRoute = () => {
  const { token, loading } = useContext(AuthContext)
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!token) return <Navigate to="/login" replace />

  return <Outlet />
}