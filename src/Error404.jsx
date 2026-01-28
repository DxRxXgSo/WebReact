import { Link } from 'react-router-dom';

function Error404() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      {/* Icono gigante */}
      <div style={{ fontSize: '100px' }}>🚧</div>
      
      <h1 style={{ color: '#f39c12', marginBottom: '10px' }}>
        ¡Estamos trabajando en esto!
      </h1>
      
      <p style={{ fontSize: '18px', color: '#555' }}>
        Esta sección está en construcción o la página que buscas no existe.
        <br />
        Por favor, vuelve más tarde.
      </p>
      
      {/* Botón para regresar */}
      <Link to="/">
        <button style={{ 
            marginTop: '20px',
            backgroundColor: '#333', 
            color: 'white', 
            padding: '12px 24px', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
        }}>
          ⬅ Volver al Inicio
        </button>
      </Link>
    </div>
  )
}

export default Error404;