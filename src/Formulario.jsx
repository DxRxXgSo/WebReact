import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import ReCAPTCHA from "react-google-recaptcha" 
import './App.css'

function Formulario() {
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const captchaRef = useRef(null)

  // --- CONFIGURACIÓN DE LA API ---
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const onChangeCaptcha = (token) => {
    setCaptchaToken(token);
  }

  const manejarEnvio = (e) => {
    e.preventDefault();

    // Validación básica
    if (!nombre.trim()) {
      alert("Por favor, ingresa un nombre válido.");
      return;
    }

    if (!captchaToken) {
      alert("Por favor, verifica que no eres un robot.");
      return;
    }

    // Petición al backend en Render
    fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nombre: nombre.trim(), 
        token: captchaToken 
      }) 
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
          setMensaje("¡Nombre guardado con éxito! ✅");
          setNombre(''); 
          setCaptchaToken(null); 
          if (captchaRef.current) captchaRef.current.reset(); 

          setTimeout(() => {
            setMensaje('');
          }, 3000);
      } else {
          alert("Error: " + data.message);
          if (captchaRef.current) captchaRef.current.reset();
          setCaptchaToken(null);
      }
    })
    .catch(err => {
      console.error("Error de conexión:", err);
      alert("No se pudo conectar con el servidor. Verifica que el backend esté 'Live' en Render.");
    });
  }

  return (
    <div className="App">
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Link to="/bienvenida">
          <button style={{ 
            backgroundColor: '#27ae60', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '25px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}>
            Ir a Bienvenida ✨
          </button>
        </Link>
      </div>

      <h1>Gestión de Usuarios</h1>
      
      <div style={{ 
        border: '2px solid #646cff', 
        padding: '30px', 
        borderRadius: '15px',
        maxWidth: '500px',
        margin: '0 auto', 
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#333' }}>Ingresa tu Nombre</h2>
        
        <form onSubmit={manejarEnvio}>
          
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder="Escribe tu nombre aquí" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)} 
              required 
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <ReCAPTCHA
              ref={captchaRef}
              sitekey="6LdmJEosAAAAABTXIAQniNuGJDCaEqVscC1TYUCO" 
              onChange={onChangeCaptcha}
            />
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Guardar Nombre
          </button>

          {mensaje && (
            <p style={{ 
              marginTop: '15px', 
              color: '#27ae60', 
              fontWeight: 'bold', 
              backgroundColor: '#e8f8f5',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #27ae60'
            }}>
              {mensaje}
            </p>
          )}

        </form>
      </div>
    </div>
  )
}

export default Formulario;