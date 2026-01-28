import { useState } from 'react';
import { Link } from 'react-router-dom';

function Calculadora() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [resultado, setResultado] = useState(null);

  const sumar = () => {
    const suma = parseFloat(num1) + parseFloat(num2);
    setResultado(`La suma es: ${suma}`);
  };

  const dividir = () => {
    const n2 = parseFloat(num2);
    if (n2 === 0) {
      setResultado("Error: No se puede dividir por cero 🚫");
    } else {
      const division = parseFloat(num1) / n2;
      setResultado(`La división es: ${division.toFixed(2)}`);
    }
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px', 
      backgroundColor: '#f3e5f5', // Fondo lila
      minHeight: '100vh',
      width: '100vw',          // <--- ASEGURA ANCHO TOTAL
      position: 'absolute',    // <--- FUERZA A CUBRIR TODO
      top: 0,
      left: 0,
      margin: 0,
      boxSizing: 'border-box', // <--- EVITA QUE EL PADDING ROMPA EL ANCHO
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#5856d6' }}>Calculadora Básica 🔢</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '15px', 
        maxWidth: '400px', 
        margin: '0 auto',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        
        {/* Input Número 1 */}
        <input 
          type="number" 
          placeholder="Número 1" 
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          style={{ padding: '10px', width: '80%', marginBottom: '10px', fontSize: '16px' }}
        />

        {/* Input Número 2 */}
        <input 
          type="number" 
          placeholder="Número 2" 
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          style={{ padding: '10px', width: '80%', marginBottom: '20px', fontSize: '16px' }}
        />

        {/* Botones de Operación */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={sumar} style={{
            backgroundColor: '#ff2d55', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
          }}>
            Sumar (+)
          </button>
          
          <button onClick={dividir} style={{
            backgroundColor: '#5856d6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
          }}>
            Dividir (÷)
          </button>
        </div>

        {/* Mostrar Resultado */}
        {resultado && (
          <div style={{ marginTop: '20px', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
            {resultado}
          </div>
        )}

      </div>

      {/* Botón Volver */}
      <div style={{ marginTop: '30px' }}>
        <Link to="/bienvenida">
          <button style={{ 
            padding: '10px 20px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' 
          }}>
            Volver
          </button>
        </Link>
      </div>

    </div>
  );
}

export default Calculadora;