
import { Sequelize } from 'sequelize';

const module = (sequelize, DataTypes) => {
    const Comment  = sequelize.define('comments', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        commentableId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'commentable_id'
        },
        commentableType: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'commentable_type'
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'author_id'
        },
        authorType: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'author_type'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.tickets, {
            foreignKey: 'commentable_id',
            constraints: false,
            as: 'ticket'
        });
        
        // associações cliente, colaborator
        Comment.belongsTo(models.clients, {
            foreignKey: 'authorId',
            constraints: false,
            as: 'client',
        });

        Comment.belongsTo(models.colaborator, {
            foreignKey: 'authorId',
            constraints: false,
            as: 'colaborator',
        });

    }

    Comment.prototype.getAuthor = async function(models) {
        if (this.authorType === 'client') {
            const client = await models.clients.findByPk(this.authorId, {
                attributes: ['name']
            });
            return client;
        } else if (this.authorType === 'colaborator') {
            const colaborator = await models.colaborator.findByPk(this.authorId, {
                attributes: ['name']
            });
            return colaborator;
        }
        return null;
    };
    

    return Comment;
}

export default module;