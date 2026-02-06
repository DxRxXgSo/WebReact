require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();

/* ===========================
   CORS (CRÍTICO – SOLUCIÓN REAL)
=========================== */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://webreact-1-iyur.onrender.com'
  ],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); // 🔥 PRE-FLIGHT
app.use(express.json());

/* ===========================
   1. CLOUDINARY
=========================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

/* ===========================
   2. POSTGRESQL (RENDER)
=========================== */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect(err => {
  if (err) {
    console.error('❌ Error PostgreSQL:', err);
  } else {
    console.log('✅ PostgreSQL conectado');
  }
});

/* ===========================
   3. USUARIOS
=========================== */
app.get('/usuarios', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM usuarios ORDER BY id DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.post('/usuarios', async (req, res) => {
  const { nombre, token } = req.body;

  if (!nombre || !token) {
    return res.status(400).json({
      success: false,
      message: 'Nombre y captcha son obligatorios'
    });
  }

  try {
    const captcha = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.VITE_RECAPTCHA_SECRET_KEY,
          response: token
        }
      }
    );

    if (!captcha.data.success) {
      return res.status(400).json({
        success: false,
        message: 'Captcha inválido'
      });
    }

    await pool.query(
      'INSERT INTO usuarios (nombre) VALUES ($1)',
      [nombre]
    );

    res.json({
      success: true,
      message: 'Usuario guardado correctamente'
    });

  } catch (error) {
    console.error('Error usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

/* ===========================
   4. CONTACTO
=========================== */
app.post('/contacto', async (req, res) => {
  const { nombre, email, telefono, fecha_nacimiento, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({
      success: false,
      message: 'Campos obligatorios faltantes'
    });
  }

  try {
    await pool.query(
      `INSERT INTO contactos
       (nombre, email, telefono, fecha_nacimiento, mensaje)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        nombre,
        email,
        telefono || null,
        fecha_nacimiento || null,
        mensaje
      ]
    );

    res.json({
      success: true,
      message: 'Mensaje enviado correctamente'
    });

  } catch (error) {
    console.error('Error contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar mensaje'
    });
  }
});

/* ===========================
   5. IMÁGENES (CLOUDINARY)
=========================== */
app.get('/imagenes', async (req, res) => {
  try {
    const { resources } = await cloudinary.search
      .expression('folder:mi_proyecto_react')
      .sort_by('created_at', 'desc')
      .execute();

    const imagenes = resources.map(img => ({
      id: img.public_id,
      url: img.secure_url,
      titulo: img.filename
    }));

    res.json(imagenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener imágenes' });
  }
});

app.post('/subir-imagen', upload.single('archivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No hay archivo' });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'mi_proyecto_react' },
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Error Cloudinary' });
      }

      res.json({
        success: true,
        url: result.secure_url,
        id: result.public_id
      });
    }
  );

  stream.end(req.file.buffer);
});

app.delete('/borrar-imagen/:id', async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.id);
    res.json({ success: result.result === 'ok' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al borrar imagen' });
  }
});

/* ===========================
   6. SERVER
=========================== */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});
