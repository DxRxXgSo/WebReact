import { useState } from 'react';
import { Link } from 'react-router-dom';

function FormularioContacto() {

  /* =========================
     1. ESTADO
  ========================== */
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    mensaje: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* =========================
     2. VALIDACIONES
  ========================== */
  const validar = (campo, valor) => {
    switch (campo) {
      case 'nombre':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) return 'Solo letras.';
        if (valor.trim().length < 2) return 'Mínimo 2 caracteres.';
        return '';

      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'Correo inválido.';
        return '';

      case 'telefono':
        if (valor && !/^\d{10}$/.test(valor)) return 'Debe tener 10 dígitos.';
        return '';

      case 'fecha_nacimiento':
        if (!valor) return '';
        const fecha = new Date(valor);
        if (isNaN(fecha.getTime())) return 'Fecha no válida.';
        return '';

      case 'mensaje':
        if (valor.trim().length < 15) return 'Mínimo 15 caracteres.';
        return '';

      default:
        return '';
    }
  };

  /* =========================
     3. HANDLE CHANGE
  ========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefono' && value.length > 10) return;
    if (name === 'nombre' && value.length > 50) return;
    if (name === 'email' && value.length > 100) return;
    if (name === 'mensaje' && value.length > 500) return;

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validar(name, value) }));
  };

  /* =========================
     4. ENVÍO AL BACKEND
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    Object.keys(formData).forEach(campo => {
      const error = validar(campo, formData[campo]);
      if (error) nuevosErrores[campo] = error;
    });

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      alert('Corrige los errores antes de enviar.');
      return;
    }

    setLoading(true);

    const API_URL = import.meta.env.DEV
      ? 'http://localhost:3001/contacto'
      : 'https://db-proyecto-97sm.onrender.com/contacto';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error del servidor');
      }

      alert('¡Mensaje enviado correctamente! 🚀');

      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        mensaje: ''
      });
      setErrors({});

    } catch (error) {
      console.error(error);
      alert('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     5. ESTILOS
  ========================== */
  const styles = {
    container: {
      backgroundColor: '#fff0e6',
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial'
    },
    formCard: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '15px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 4px 15px rgba(0,0,0,.1)'
    },
    label: { fontWeight: 'bold', marginTop: '10px' },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      marginBottom: '5px'
    },
    error: { color: '#ff6b6b', fontSize: '12px' },
    button: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#9575cd',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      marginTop: '20px',
      fontSize: '16px',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1
    }
  };

  /* =========================
     6. RENDER
  ========================== */
  return (
    <div style={styles.container}>
      <form style={styles.formCard} onSubmit={handleSubmit} noValidate>

        <label style={styles.label}>Nombre</label>
        <input style={styles.input} name="nombre" value={formData.nombre} onChange={handleChange} />
        {errors.nombre && <div style={styles.error}>{errors.nombre}</div>}

        <label style={styles.label}>Correo</label>
        <input style={styles.input} name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <div style={styles.error}>{errors.email}</div>}

        <label style={styles.label}>Teléfono</label>
        <input style={styles.input} name="telefono" value={formData.telefono} onChange={handleChange} />
        {errors.telefono && <div style={styles.error}>{errors.telefono}</div>}

        <label style={styles.label}>Fecha de nacimiento</label>
        <input style={styles.input} type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />

        <label style={styles.label}>Mensaje</label>
        <textarea style={styles.input} rows="4" name="mensaje" value={formData.mensaje} onChange={handleChange} />
        {errors.mensaje && <div style={styles.error}>{errors.mensaje}</div>}

        <button style={styles.button} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/bienvenida">← Volver</Link>
        </div>

      </form>
    </div>
  );
}

export default FormularioContacto;
