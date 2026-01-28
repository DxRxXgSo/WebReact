import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Galeria() {
  const [imagenes, setImagenes] = useState([]); 
  const [actual, setActual] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/imagenes')
      .then(res => res.json())
      .then(data => {
         if(Array.isArray(data) && data.length > 0) {
            setImagenes(data);
         }
      })
      .catch(err => console.error("Error cargando galería:", err));
  }, []);

  const siguiente = () => {
    if (imagenes.length > 0) {
        setActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
    }
  };

  const anterior = () => {
    if (imagenes.length > 0) {
        setActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    if (imagenes.length === 0) return;
    const intervalo = setInterval(siguiente, 4000);
    return () => clearInterval(intervalo);
  }, [actual, imagenes]);

  // --- FUNCIÓN DE SUBIDA CON FILTRO DE ARCHIVOS ---
  const manejarSubida = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // VALIDACIÓN DE SEGURIDAD EN EL FRONTEND
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
        alert("❌ Error: Solo puedes subir imágenes (JPG, PNG, WEBP).");
        e.target.value = null; // Limpiar el input
        return;
    }

    setCargando(true);
    const formData = new FormData();
    formData.append('archivo', file);

    try {
        const respuesta = await fetch('http://localhost:3001/subir-imagen', {
            method: 'POST',
            body: formData
        });
        const data = await respuesta.json();

        if (data.success) {
            const nuevaImagen = {
                id: data.id, 
                url: data.url,
                titulo: file.name
            };
            setImagenes([nuevaImagen, ...imagenes]);
            setActual(0);
            alert("¡Imagen subida con éxito! 🎉");
        } else {
            alert('Error al subir: ' + data.message);
        }
    } catch (error) {
        alert('Error de conexión');
    } finally {
        setCargando(false);
        e.target.value = null; 
    }
  };

  const manejarBorrado = async (idToDelete, e) => {
    e.stopPropagation(); 
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta imagen?")) return;

    try {
        const respuesta = await fetch(`http://localhost:3001/borrar-imagen/${encodeURIComponent(idToDelete)}`, {
            method: 'DELETE'
        });
        const data = await respuesta.json();

        if (data.success) {
            const nuevasImagenes = imagenes.filter(img => img.id !== idToDelete);
            setImagenes(nuevasImagenes);
            if (actual >= nuevasImagenes.length && nuevasImagenes.length > 0) {
                setActual(nuevasImagenes.length - 1);
            }
            alert("Imagen eliminada 🗑️");
        } else {
            alert("No se pudo eliminar: " + data.message);
        }
    } catch (error) {
        alert("Error de conexión al borrar");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, fontFamily: 'Arial, sans-serif' }}>
      
      <div style={{ width: '30%', backgroundColor: '#fff8e1', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', borderRight: '2px solid #ffe0b2', overflowY: 'auto' }}>
        
        <h2 style={{ color: '#ff6f00', marginTop: 0 }}>📸 Mi Galería Cloud</h2>
        
        <Link to="/bienvenida" style={{ textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
          <span style={{ fontSize: '14px', color: '#ff6f00', fontWeight: 'bold' }}>← Volver al Menú</span>
        </Link>

        <div style={{ marginBottom: '25px', textAlign: 'center' }}>
            {/* 1. SE AGREGA EL ATRIBUTO "accept" PARA FILTRAR EN EL EXPLORADOR DE ARCHIVOS */}
            <input 
                type="file" 
                id="fileInput" 
                accept=".jpg, .jpeg, .png, .webp" 
                onChange={manejarSubida} 
                disabled={cargando} 
                style={{ display: 'none' }} 
            />
            <label htmlFor="fileInput" style={{
                display: 'inline-block', padding: '12px 24px',
                backgroundColor: cargando ? '#ccc' : '#ff6f00',
                color: 'white', borderRadius: '30px',
                cursor: cargando ? 'not-allowed' : 'pointer',
                fontWeight: 'bold', fontSize: '16px',
                boxShadow: '0 4px 10px rgba(255, 111, 0, 0.3)'
            }}>
                {cargando ? 'Subiendo... ☁️' : '📤 Subir nueva foto'}
            </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px' }}>
          {imagenes.map((img, index) => (
            <div key={img.id} onClick={() => setActual(index)}
              style={{
                position: 'relative', cursor: 'pointer', 
                border: actual === index ? '3px solid #ff6f00' : '2px solid transparent',
                borderRadius: '8px', overflow: 'hidden', aspectRatio: '1/1', 
                opacity: actual === index ? 1 : 0.7, transition: 'all 0.2s'
              }}
            >
              <img src={img.url} alt="miniatura" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              <button 
                onClick={(e) => manejarBorrado(img.id, e)}
                style={{
                    position: 'absolute', top: '5px', right: '5px',
                    backgroundColor: 'rgba(255, 0, 0, 0.8)', color: 'white',
                    border: 'none', borderRadius: '50%', width: '22px', height: '22px',
                    cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}
              >✕</button>
            </div>
          ))}
          {imagenes.length === 0 && !cargando && <p style={{color:'#999', fontSize:'14px'}}>No hay fotos aún.</p>}
        </div>
      </div>

      <div style={{ width: '70%', backgroundColor: '#263238', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        {imagenes.length > 0 ? (
            <>
                <img src={imagenes[actual].url} alt="Principal"
                  style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
                />
                <button onClick={anterior} style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer' }}>❮</button>
                <button onClick={siguiente} style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer' }}>❯</button>
            </>
        ) : (
            <div style={{color:'white', textAlign:'center'}}>
                <h2>Galería Vacía 📭</h2>
                <p>Usa el botón naranja para subir tu primera foto.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default Galeria;