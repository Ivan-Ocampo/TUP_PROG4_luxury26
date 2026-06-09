import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUsuario } from "../../services/authService";

// Importamos los íconos del ojito
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Reutilizamos CSS de CargarProducto
import "../altaProducto/AltaProducto.css";

const Login = () => {
  const navigate = useNavigate();

  const [credenciales, setCredenciales] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // --- ESTADO PARA CONTROLAR EL OJITO ---
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleChange = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };

  // --- FUNCIÓN PARA ALTERNAR EL OJITO ---
  const togglePassword = () => {
    setMostrarPassword(!mostrarPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Mandamos las credenciales al backend
      const data = await loginUsuario(credenciales);

      // 2. ¡Atrapamos el token y lo guardamos en el LocalStorage!
      localStorage.setItem("token", data.token);

      alert("¡Login exitoso!");

      // 3. Lo llevamos a la página principal o al panel de admin
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Mostramos el error exacto que manda tu backend (ej: "Contraseña incorrecta")
      setError(
        error.response?.data?.mensaje || "Hubo un error al iniciar sesión",
      );
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "15px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="joya-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="ejemplo@dominio.com"
            value={credenciales.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <div className="password-input-container">
            <input
              // Si mostrarPassword es true, el tipo es "text". Si es false, es "password"
              type={mostrarPassword ? "text" : "password"}
              name="password"
              value={credenciales.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={togglePassword}
            >
              {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-save">
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-cancel"
          >
            Cancelar
          </button>
        </div>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "0.95rem",
          }}
        >
          <span>¿No tenés cuenta? </span>
          <Link
            to="/registro"
            style={{
              color: "#5a189a",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Registrate
          </Link>
        </div>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <Link
            to="/forgot-password"
            style={{
              color: "#5a189a",
              fontSize: "0.9rem",
              textDecoration: "underline",
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
