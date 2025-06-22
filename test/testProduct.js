// testProduct.js
const models = require('../models'); // ajuste o caminho para onde está seu index.js do Sequelize

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

async function run() {
  try {
    const id = 112; // id que você quer testar

    let data = await models.products.findByPk(id, {
      include: [
        { model: models.categories, as: 'category' },
        {
          model: models.ProductAttributes,
          as: 'productAttributes',
          include: [
            {
              model: models.AttributeValue,
              as: 'value',
              include: [{ model: models.Attribute, as: 'attribute' }],
            },
          ],
        },
      ],
    });

    data = data.toJSON(); // <-- importante!
    data = formatProductAttributes(data);

    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Erro na consulta:', err);
  } finally {
  }
}

run();
