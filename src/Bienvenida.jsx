import { Link } from 'react-router-dom';

function Bienvenida() {

  // Definimos los datos de los botones
  const opciones = [
    { titulo: 'Calculadora', desc: 'Suma y divide números', color: '#5856d6', icon: '🔢', link: '/calculadora' },
    { titulo: 'Formulario', desc: 'Con validación de campos', color: '#ff2d55', icon: '📝', link: '/formulario' },
    
    // Botón unificado 👇
    { titulo: 'Galería y Carrusel', desc: 'Sube y visualiza fotos', color: '#ffcc00', icon: '📷', link: '/galeria' },
  ];

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px', 
      backgroundColor: '#fff3e0', 
      minHeight: '100vh',
      width: '100vw',          // <--- ASEGURA ANCHO TOTAL
      position: 'absolute',    // <--- FUERZA A CUBRIR TODO
      top: 0,
      left: 0,
      margin: 0,
      boxSizing: 'border-box', // <--- EVITA QUE EL PADDING ROMPA EL ANCHO
      color: '#d35400',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ fontSize: '80px' }}>🏡✨</div>
      
      <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>
        ¡Te damos la Bienvenida!
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: '#5d4037', maxWidth: '600px', margin: '0 auto' }}>
        Nos alegra mucho tenerte aquí. Este es un espacio seguro diseñado para ti.
      </p>

      {/* --- SECCIÓN NUEVA: ¿QUÉ QUIERES HACER? --- */}
      <div style={{ marginTop: '50px' }}>
        <h2 style={{ color: '#d35400', marginBottom: '20px' }}>¿Qué quieres hacer?</h2>
        
        <div style={{ 
          display: 'flex',            
          flexDirection: 'row',       
          justifyContent: 'center',   
          gap: '15px',                
          flexWrap: 'wrap'            
        }}>
          
          {opciones.map((item, index) => (
            <Link key={index} to={item.link || '#'} style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: item.color,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '15px',
                width: '200px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '30px', marginRight: '12px' }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.titulo}</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>{item.desc}</div>
                </div>
              </button>
            </Link>
          ))}

        </div>
      </div>

      {/* Botón para regresar */}
      <div style={{ marginTop: '60px' }}>
        <Link to="/">
          <button style={{ 
            padding: '10px 25px', 
            fontSize: '16px', 
            backgroundColor: '#e67e22', 
            color: 'white', 
            border: 'none', 
            borderRadius: '25px', 
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            Regresar al Registro
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Bienvenida;