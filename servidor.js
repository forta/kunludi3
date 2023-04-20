const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Obtiene la ruta del archivo solicitado
  const filePath = path.join(__dirname, req.url);

  // Comprueba si el archivo existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Archivo no encontrado');
    } else {
      // Lee el archivo y establece el tipo de contenido adecuado
      const contentType = getContentType(filePath);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Error interno del servidor');
        } else {
          res.writeHead(200, {'Content-Type': contentType});
          res.end(data);
        }
      });
    }
  });
});

server.listen(30000, () => {
  console.log('Servidor iniciado en el puerto 30000');
});

// Función para obtener el tipo de contenido del archivo
function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}
