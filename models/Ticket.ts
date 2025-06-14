const module = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('tickets', {  // Nome do model com inicial maiúscula e singular
      id: {
        type: DataTypes.INTEGER,   // Use DataTypes
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      colaboratorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM('conta', 'pagamento', 'entrega', 'produto', 'outros'),
        allowNull: false
      },
      priority: {
        type: DataTypes.ENUM('baixa', 'media', 'alta'),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('aberto', 'andamento', 'resolvido', 'fechado'),
        allowNull: false,
        defaultValue: 'aberto'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
     
    },
  );
  
    Ticket.associate = (models) => {
      Ticket.belongsTo(models.clients, { foreignKey: 'clientId', as: 'client' });
      Ticket.belongsTo(models.colaborator, { foreignKey: 'colaboratorId', as: 'colaborator' });
      Ticket.hasMany(models.comments, {
        foreignKey: 'commentableId',
        constraints: false,
        scope: {
          commentableType: 'ticket'
        },
        as: 'comments'
      })
    };
  
    return Ticket;
  };
  
  export default module;