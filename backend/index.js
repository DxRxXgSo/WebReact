const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json());

// 1. CONFIGURACIÓN DE CLOUDINARY
// Se recomienda usar process.env para no exponer tus claves en GitHub
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dhyze2nig', 
    api_key: process.env.CLOUDINARY_API_KEY || '853673662349928', 
    api_secret: process.env.CLOUDINARY_API_SECRET || 'QucyRtMzxdPLCGAnhqVi-ZBZKH4' 
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 2. CONEXIÓN A POSTGRESQL (Render)
const pool = new Pool({
    // Usamos la variable de entorno de Render para mayor seguridad
    connectionString: process.env.DATABASE_URL || 'postgresql://db_proyecto_97sm_user:HzjLjVeZbwgurLgRYPCUyrcK7BcHPY58@dpg-d5t4d3ngi27c7380d6og-a.ohio-postgres.render.com/db_proyecto_97sm',
    ssl: {
        rejectUnauthorized: false 
    }
});

// Verificación de conexión
pool.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión a la base de datos:', err.stack);
    } else {
        console.log('✅ Conexión establecida con PostgreSQL en Render');
    }
});

// 3. RUTAS DE USUARIOS
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

app.post('/usuarios', async (req, res) => {
    const { nombre, token } = req.body;

    if (!token) return res.status(400).json({ success: false, message: "Falta el Captcha" });
    if (!nombre) return res.status(400).json({ success: false, message: "El nombre es obligatorio" });

    // Se usa la clave secreta desde variables de entorno
    const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LdmJEosAAAAAK8ucc-lLN6l3suU3bgzoBx7bQyb'; 

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`
        );

        if (!response.data.success) {
            return res.status(400).json({ success: false, message: "Captcha inválido" });
        }

        const sql = 'INSERT INTO usuarios (nombre) VALUES ($1) RETURNING *';
        await pool.query(sql, [nombre]);
        
        return res.json({ success: true, message: "Usuario guardado exitosamente" });

    } catch (error) {
        console.error("Error en servidor al validar captcha:", error);
        return res.status(500).json({ success: false, message: "Error de servidor" });
    }
});

// --- RUTA: FORMULARIO DE CONTACTO ---
app.post('/contacto', async (req, res) => {
    const { nombre, email, telefono, fechaNacimiento, mensaje } = req.body;

    try {
        const sql = `
            INSERT INTO contactos (nombre, email, telefono, fecha_nacimiento, mensaje) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const values = [nombre, email, telefono, fechaNacimiento, mensaje];
        
        await pool.query(sql, values);
        res.json({ success: true, message: "Mensaje de contacto guardado correctamente" });
    } catch (error) {
        console.error("Error al guardar contacto:", error);
        res.status(500).json({ success: false, message: "Error al guardar en la base de datos" });
    }
});

// 4. RUTAS DE IMÁGENES (Cloudinary)
app.post('/subir-imagen', (req, res) => {
    upload.single('archivo')(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        if (!req.file) return res.status(400).json({ success: false, message: 'No hay archivo' });

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "mi_proyecto_react" }, 
            (error, result) => {
                if (error) {
                    console.error("Error Cloudinary:", error);
                    return res.status(500).json({ success: false, message: 'Error Cloudinary' });
                }
                res.json({ success: true, url: result.secure_url, id: result.public_id });
            }
        );
        uploadStream.end(req.file.buffer);
    });
});

// 5. INICIO DEL SERVIDOR
// Importante: process.env.PORT es obligatorio para que Render funcione
const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});