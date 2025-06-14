  import fs from 'fs';
  import path from 'path';
  import { Op } from "sequelize";

const checkEntityExists = async (entity: any, entityName: string) => {
    if (!entity) {
      throw new Error(`${entityName} não encontrado`);
    }
  };
  
  const findImageByName = (imageName: string, dirPath: string) => {
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, (err, files) => {
        if (err) {
          reject('Unable to scan directory:');
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
  
const getImagesFromFolder = async (itemId: string | number, folder: string) => {
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

enum OrderByEnum {
  createdAt = 'created_at',
  updatedAt = 'updated_at'
}

enum OrderTypeEnum {
  asc = 'ASC',
  desc = 'desc'
}

interface PropsResponse {
  page?: number,
  pageSize?: number,
  searchTerm?: string | null,
  deleted?: boolean,
  orderBy?: OrderByEnum | null,
  orderType?: OrderTypeEnum | null
}

const getPropsResponse = ({page = 1, pageSize = 7, searchTerm = null, deleted = false, orderBy = OrderByEnum.createdAt, orderType = OrderTypeEnum.asc}: PropsResponse ) => {
  const offset = (page - 1) * pageSize;

  const props = {
    order: [[orderBy, orderType]],
    limit: pageSize,
    offset,
  }

  const condition: {
    name?: { [key: symbol]: string } | null,
    deleted_at?: { [key: symbol]: any } | null
  } = {};

  condition.name = { [Op.like]: `%${searchTerm}%` };

  //@ts-ignore
  if(deleted === true) {
    condition.deleted_at = {[Op.ne] : null};
  } else {
    condition.deleted_at = null;
  }

  
  (props as any).where = condition;
  return props;
  
}

function hideMail(email: string) {
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


module.exports = { checkEntityExists, findImageByName, findRootPath, getImagesFromFolder, getPropsResponse, hideMail };