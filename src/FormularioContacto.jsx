import { useState } from 'react';
import { Link } from 'react-router-dom';

function FormularioContacto() {
  // 1. Estados para guardar los valores
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    mensaje: ''
  });

  // 2. Estados para guardar los mensajes de error
  const [errors, setErrors] = useState({});

  // 3. Función de Validación
  const validar = (nombre, valor) => {
    switch (nombre) {
      case 'nombre':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) return "Solo se permiten letras.";
        if (valor.length < 2) return "Mínimo 2 caracteres.";
        return "";
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return "Correo inválido.";
        return "";
      case 'telefono':
        if (!/^\d+$/.test(valor)) return "Solo se permiten números.";
        if (valor.length !== 10) return "Debe tener exactamente 10 dígitos.";
        return "";
      case 'fechaNacimiento':
        if (!valor) return "La fecha es obligatoria.";
        const fecha = new Date(valor);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fecha.getFullYear();
        if (edad > 200 || edad < 0) return "La fecha no es válida (Máx 200 años).";
        return "";
      case 'mensaje':
        if (valor.length < 15) return "El mensaje es muy corto (Mínimo 15).";
        return "";
      default:
        return "";
    }
  };

  // 4. Manejador de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Límites de longitud
    if (name === 'telefono' && value.length > 10) return;
    if (name === 'nombre' && value.length > 50) return;
    if (name === 'mensaje' && value.length > 500) return;
    if (name === 'email' && value.length > 100) return;

    setFormData({ ...formData, [name]: value });
    const errorMsg = validar(name, value);
    setErrors({ ...errors, [name]: errorMsg });
  };

  // 5. Manejador de envío (CONEXIÓN AL BACKEND CORREGIDA)
  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    
    // Validar todos los campos antes de enviar
    Object.keys(formData).forEach((key) => {
      const error = validar(key, formData[key]);
      if (error) nuevosErrores[key] = error;
    });

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      alert("Por favor corrige los errores antes de enviar.");
    } else {
      
      // --- LÓGICA DE CONEXIÓN DINÁMICA ---
      // Si el navegador detecta que estás en localhost, usa el puerto 3001. 
      // Si no, usa tu URL de Render.
      const backendURL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/contacto' 
        : 'https://db-proyecto-97sm.onrender.com/contacto'; 

      fetch(backendURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("¡Mensaje enviado y guardado con éxito! 🚀");
          // Limpiar el formulario tras éxito
          setFormData({
            nombre: '',
            email: '',
            telefono: '',
            fechaNacimiento: '',
            mensaje: ''
          });
          setErrors({});
        } else {
          alert("Error del servidor: " + data.message);
        }
      })
      .catch(err => {
        console.error("Error de conexión:", err);
        alert("No se pudo conectar con el servidor. Revisa que el backend esté encendido.");
      });
    }
  };

  // --- ESTILOS PASTEL ---
  const styles = {
    container: {
      backgroundColor: '#fff0e6',
      color: '#4a4a4a',
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '40px',
      paddingBottom: '40px',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      position: 'absolute',
      top: 0,
      left: 0
    },
    formCard: {
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '15px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#4a4a4a'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
      color: '#333',
      fontSize: '16px',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    errorText: {
      color: '#ff6b6b',
      fontSize: '12px',
      marginTop: '5px'
    },
    counter: {
      float: 'right',
      fontSize: '12px',
      color: '#999'
    },
    button: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#9575cd',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'background 0.3s',
      boxSizing: 'border-box',
      boxShadow: '0 4px 6px rgba(149, 117, 205, 0.3)'
    }
  };

  const asteriskColor = '#ff6b6b';
  const normalBorder = '#ddd';

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ 
          backgroundColor: '#f8bbd0', 
          borderRadius: '50%', 
          width: '50px', 
          height: '50px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginRight: '15px',
          fontSize: '24px',
          color: 'white'
        }}>📄</div>
        <div>
          <h2 style={{ margin: 0, color: '#5d4037' }}>Formulario de Contacto</h2>
          <span style={{ color: '#999', fontSize: '14px' }}>Todos los campos son obligatorios</span>
        </div>
      </div>

      <form style={styles.formCard} onSubmit={handleSubmit}>
        
        {/* Nombre */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>
            👤 Nombre completo <span style={{color: asteriskColor}}>*</span>
            <span style={styles.counter}>{formData.nombre.length}/50</span>
          </label>
          <input 
            type="text" 
            name="nombre"
            placeholder="Juan Pérez" 
            value={formData.nombre}
            onChange={handleChange}
            style={{...styles.input, borderColor: errors.nombre ? asteriskColor : normalBorder}}
          />
          {errors.nombre && <div style={styles.errorText}>{errors.nombre}</div>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>
            ✉️ Correo electrónico <span style={{color: asteriskColor}}>*</span>
            <span style={styles.counter}>{formData.email.length}/100</span>
          </label>
          <input 
            type="email" 
            name="email"
            placeholder="juan@ejemplo.com" 
            value={formData.email}
            onChange={handleChange}
            style={{...styles.input, borderColor: errors.email ? asteriskColor : normalBorder}}
          />
          {errors.email && <div style={styles.errorText}>{errors.email}</div>}
        </div>

        {/* Teléfono */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>
            📞 Teléfono <span style={{color: asteriskColor}}>*</span>
            <span style={styles.counter}>{formData.telefono.length}/10</span>
          </label>
          <input 
            type="text" 
            name="telefono"
            placeholder="5512345678" 
            value={formData.telefono}
            onChange={handleChange}
            style={{...styles.input, borderColor: errors.telefono ? asteriskColor : normalBorder}}
          />
          {errors.telefono && <div style={styles.errorText}>{errors.telefono}</div>}
        </div>

        {/* Fecha */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>
            📅 Fecha de nacimiento <span style={{color: asteriskColor}}>*</span>
          </label>
          <input 
            type="date" 
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            style={{...styles.input, borderColor: errors.fechaNacimiento ? asteriskColor : normalBorder}}
          />
          {errors.fechaNacimiento && <div style={styles.errorText}>{errors.fechaNacimiento}</div>}
        </div>

        {/* Mensaje */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>
            💬 Mensaje <span style={{color: asteriskColor}}>*</span>
            <span style={styles.counter}>{formData.mensaje.length}/500</span>
          </label>
          <textarea 
            name="mensaje"
            rows="4"
            placeholder="Escribe tu mensaje aquí..."
            value={formData.mensaje}
            onChange={handleChange}
            style={{
              ...styles.input, 
              fontFamily: 'Arial', 
              resize:'vertical', 
              borderColor: errors.mensaje ? asteriskColor : normalBorder
            }}
          />
          {errors.mensaje && <div style={styles.errorText}>{errors.mensaje}</div>}
        </div>

        <button type="submit" style={styles.button}>
          🚀 Enviar Formulario
        </button>

        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <Link to="/bienvenida" style={{ color: '#9575cd', textDecoration: 'none', fontWeight: 'bold' }}>
                ← Volver al Inicio
            </Link>
        </div>
      </form>
    </div>
  );
}

export default FormularioContacto;