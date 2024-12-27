const checkEntityExists = async (entity, entityName) => {
    if (!entity) {
      throw new Error(`${entityName} não encontrado`);
    }
  };

module.exports = { checkEntityExists };