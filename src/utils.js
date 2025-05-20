  const fs = require('fs');
  const path = require('path');

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

const getPropsResponse = ({page = 1, pageSize = 7, searchTerm = null, deleted = false, orderBy = 'created_at', orderType = 'ASC'} = {}) => {
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
  if(deleted) {
    condition.deleted_at = {[Op.ne] : null};
  }
  props.where = condition;
  return props;
  
}

module.exports = { checkEntityExists, findImageByName, findRootPath, getImagesFromFolder, getPropsResponse };