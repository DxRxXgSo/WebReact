require('dotenv').config(); // Importante para leer las variables del archivo .env local
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
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 2. CONEXIÓN A POSTGRESQL (Render)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL ,
    ssl: {
        rejectUnauthorized: false 
    }
});

// Verificación de conexión
pool.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión:', err.stack);
    } else {
        console.log('✅ Conexión establecida con PostgreSQL en Render');
    }
});

// 3. RUTAS DE USUARIOS (Login rápido)
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

app.post('/usuarios', async (req, res) => {
    const { nombre, token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "Falta el Captcha" });
    if (!nombre) return res.status(400).json({ success: false, message: "El nombre es obligatorio" });

    const SECRET_KEY = process.env.VITE_RECAPTCHA_SECRET_KEY; 

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
        console.error("Error en servidor:", error);
        return res.status(500).json({ success: false, message: "Error de servidor" });
    }
});

// 4. RUTA: FORMULARIO DE CONTACTO
app.post('/contacto', async (req, res) => {
    const { nombre, email, telefono, fechaNacimiento, mensaje } = req.body;
    try {
        const sql = `
            INSERT INTO contactos (nombre, email, telefono, fecha_nacimiento, mensaje) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const values = [nombre, email, telefono, fechaNacimiento, mensaje];
        await pool.query(sql, values);
        res.json({ success: true, message: "Mensaje guardado correctamente" });
    } catch (error) {
        console.error("Error al guardar contacto:", error);
        res.status(500).json({ success: false, message: "Error en la base de datos" });
    }
});

// 5. RUTAS DE IMÁGENES (Cloudinary)
app.post('/subir-imagen', (req, res) => {
    upload.single('archivo')(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        if (!req.file) return res.status(400).json({ success: false, message: 'No hay archivo' });

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "mi_proyecto_react" }, 
            (error, result) => {
                if (error) return res.status(500).json({ success: false, message: 'Error Cloudinary' });
                // Devolvemos secure_url para la imagen y public_id para poder borrarla después
                res.json({ success: true, url: result.secure_url, id: result.public_id });
            }
        );
        uploadStream.end(req.file.buffer);
    });
});

// --- NUEVA RUTA: BORRAR IMAGEN (Para que el botón '✕' de la Galería funcione) ---
app.delete('/borrar-imagen/:id', async (req, res) => {
    const publicId = req.params.id;
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === 'ok') {
            res.json({ success: true, message: "Imagen eliminada de la nube" });
        } else {
            res.status(400).json({ success: false, message: "No se pudo borrar o no existe" });
        }
    } catch (error) {
        console.error("Error al borrar:", error);
        res.status(500).json({ success: false, message: "Error en servidor de imágenes" });
    }
});

// 6. INICIO DEL SERVIDOR
const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});