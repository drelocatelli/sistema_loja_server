  const fs = require('fs');
  const path = require('path');
  const { Op } = require("sequelize");

const checkEntityExists = async (entity, entityName) => {
    if (!entity) {
      throw new Error(`${entityName} não encontrado`);
    }
  };
  
  const findImageByName = (imageName, dirPath) => {
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, (err, files) => {
        if (err) {
          reject('Unable to scan directory:', err);
          return;
        }
  
        // Look for the image by its name (without the extension)
        const imageFile = files.find(file => {
          const fileNameWithoutExt = path.parse(file).name.toLowerCase();
          return fileNameWithoutExt === imageName.toLowerCase();
        });
  
        // Resolve with the image path or null if not found
        if (imageFile) {
          resolve(path.join(dirPath, imageFile));
        } else {
          resolve(null);  // Return null if no image is found
        }
      });
    });
  };
  
  const findRootPath = () => {
    let dir = __dirname;
    
    // Traverse upwards until we find package.json
    while (!fs.existsSync(path.join(dir, 'package.json'))) {
      const parentDir = path.dirname(dir);
      if (parentDir === dir) {
        throw new Error('No package.json found, unable to determine the root path');
      }
      dir = parentDir;
    }
    
    return dir;
  };
  
const getImagesFromFolder = async (itemId, folder) => {
  const dirPath = path.join(findRootPath(), 'public', 'uploads', 'imgs', folder, itemId.toString());

  if(!fs.existsSync(dirPath)) {
    return [];
  }

  // read the dir
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, async (err, files) => {
      
      if (err) {
        console.log(err)
        resolve([]);
      }
  
      const filesUrls = files.map(file => `uploads/imgs/${folder}/${itemId}/${file}`);
  
      resolve(filesUrls ?? []);
      
    });
    
  })
}

const getPropsResponse = ({page = 1, pageSize = 7, searchTerm = null, deleted = false, hasDeleted = false, orderBy = 'created_at', orderType = 'ASC'} = {}) => {
  const offset = (page - 1) * pageSize;

  const props = {
    order: [[orderBy, orderType]],
    limit: pageSize,
    offset,
  }

  const condition = {};

  if(searchTerm && searchTerm.length != 0) {
    condition.name = {[Op.like] : `%${searchTerm}%`};
  }
  if(deleted === true) {
    condition.deleted_at = {[Op.ne] : null};
  } else if(hasDeleted) {
    condition.deleted_at = {[Op.eq] : null};
  }
  
  props.where = condition;
  return props;
  
}

function hideMail(email) {
  let [usuario, dominio] = email.split("@");
  let visiveis;

  if(!dominio) {
    dominio = '';
  }

  if (usuario.length <= 2) {
    visiveis = 1;
  } else if (usuario.length <= 6) {
    visiveis = 2;
  } else {
    visiveis = Math.floor(usuario.length / 2);

  }


  const parteVisivel = usuario.slice(0, visiveis);
  const parteOculta = '*'.repeat(usuario.length - visiveis);

  return `${parteVisivel}${parteOculta}${dominio ? '@' + dominio : ''}`;
}

function formatProductAttributes(product) {
  if (!product) return null;
  const grouped = {};

  product.productAttributes.forEach((pa) => {
    const attrId = pa.value.attribute.id;
    const attrName = pa.value.attribute.name;

    if (!grouped[attrId]) {
      grouped[attrId] = {
        id: attrId,
        name: attrName,
        values: [],
      };
    }

    grouped[attrId].values.push({
      id: pa.value.id,
      value: pa.value.value,
      attribute_id: pa.value.attribute_id,
      quantity: pa.quantity, // pega quantity do productAttributes
    });
  });

  product.attributes = Object.values(grouped);
  delete product.productAttributes;
  return product;
}

module.exports = { checkEntityExists, findImageByName, findRootPath, getImagesFromFolder, getPropsResponse, hideMail, formatProductAttributes };