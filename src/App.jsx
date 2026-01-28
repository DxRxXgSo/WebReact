import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Formulario from './Formulario'; 
import FormularioContacto from './FormularioContacto'; 
import Bienvenida from './Bienvenida';
import Calculadora from './Calculadora';
import Galeria from './Galeria'; // <--- 1. IMPORTAR GALERÍA
import Error404 from './Error404';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. LOGIN */}
        <Route path="/" element={<Formulario />} />

        {/* 2. MENÚ PRINCIPAL */}
        <Route path="/bienvenida" element={<Bienvenida />} />

        {/* 3. HERRAMIENTAS */}
        <Route path="/formulario" element={<FormularioContacto />} />
        <Route path="/calculadora" element={<Calculadora />} />
        
        {/* 4. NUEVA RUTA DE GALERÍA (Faltaba esta) */}
        <Route path="/galeria" element={<Galeria />} />

        {/* ERROR */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;