const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { findImageByName } = require('../src/utils');
const authMiddlewareExpress = require('../src/middlewares/loginExpressMiddleware');
const cors = require('cors');
const authCustomerMiddlewareExpress = require('../src/middlewares/customerExpressMiddleware');

const uploadEndpoint = './public/uploads';

const router = express();
router.use(cors())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.body.path || ''; // Diretório especificado no campo "path"

    const fullPath = path.join(uploadEndpoint, uploadPath);

    fs.mkdirSync(fullPath, { recursive: true });
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Usa o nome original do arquivo
  },
});

const storageTicket = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'ticket'; // Diretório especificado no campo "path"

    const fullPath = path.join(uploadEndpoint, 'imgs', uploadPath);

    fs.mkdirSync(fullPath, { recursive: true });
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Usa o nome original do arquivo
  },
});

const upload = multer({ storage });
const uploadTicket = multer({ storage: storageTicket });

router.post('/upload', authMiddlewareExpress, upload.single('file'), (req, res) => {
  console.log('enviando arquivo...')

  console.log(req.body)
  
  if(!req.file) {
    return res.status(400).json({message: 'Não foi possível enviar arquivo'});
  }

  res.status(200).json({
    message: 'Arquivo enviado com sucesso!',
    file: req.file, // Detalhes do arquivo enviado
    body: req.body, // Outros campos enviados no formulário
  });
});

router.post('/upload/customer', authCustomerMiddlewareExpress, uploadTicket.single('file'), (req, res) => {
  console.log('cliente enviando arquivo...')


  if(!req.file) {
    return res.status(400).json({message: 'Não foi possível enviar arquivo'});
  }
  
  res.json({
    message: 'Arquivo enviado com sucesso!',
    file: req.file, // Detalhes do arquivo enviado
    body: req.body, // Outros campos enviados no formulário
  })
});

router.get('/static/products/:filename', async (req, res) => {
  // Validate `filename` parameter
  try {
    const filename = req.params.filename;
    if (!filename) {
      return res.status(400).send('Filename is required');
    }

    
    // Define the full path to the file
    const ptfile = await findImageByName(filename, path.join(__dirname, '..', 'public', 'uploads', 'imgs', 'products'))
    const filePath = ptfile;
  
    // Send the file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err); // Log the error for debugging
        res.status(404).send('File not found');
      }
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send('Internal Server Error');
  }

});


module.exports = router;