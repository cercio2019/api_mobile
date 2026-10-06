const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Carpeta donde se guardaran las imagenes de los productos
const carpetaDestino = path.join(__dirname, '..', '..', 'uploads', 'productos');

// Se asegura que la carpeta exista
if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino, { recursive: true });
}

// Configuracion de almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaDestino);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const nombreUnico = `producto_${Date.now()}_${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, nombreUnico);
  },
});

// Solo se permiten imagenes
const filtroArchivos = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
  const extensionValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimeValido = tiposPermitidos.test(file.mimetype);

  if (extensionValida && mimeValido) {
    return cb(null, true);
  }
  cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png, gif, webp)'));
};

const upload = multer({
  storage,
  fileFilter: filtroArchivos,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB maximo
});

module.exports = upload;
