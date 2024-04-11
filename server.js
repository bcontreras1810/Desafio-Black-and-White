//importo los modulos necesarios 
import express from 'express';
import jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';

//creo una instancia para express
const app = express();

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use("/css", express.static("/node_modules/bootstrap/dist/css"));

// Ruta para procesar la imagen
app.get('/imagen', async (req, res) => {
  const { imageUrl } = req.query;

  // Comprobar si se proporcionó una URL de imagen
  if (!imageUrl) {
    return res.status(400).send('No se proporcionó una URL de imagen');
  }
  // Leer la imagen desde la URL proporcionada
  try {
    const image = await jimp.read(imageUrl);
    // // Procesar la imagen: redimensionar, convertir a escala de grises y redimensionada a unos 350px de ancho
    image.resize(350, jimp.AUTO)
    .greyscale();

    // Generar un uuid único para la imagen procesada
    const imageName = `${uuidv4()}.jpg`;
    //// Guardar la imagen procesada en el directorio 'public/img'
    await image.writeAsync(`public/img/${imageName}`);

     // Enviar la etiqueta <img> con la ruta de la imagen procesada como respuesta
    res.send(`<img src="/img/${imageName}" alt="Imagen procesada">`);
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).send('Error al procesar la imagen');
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
  });
  
  //Middleware de error.
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('!Se ha producido un error!');
  });