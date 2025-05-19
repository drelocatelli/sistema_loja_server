const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../../../../models');

module.exports = {
    Mutation: {
        login: async (_, {user, password}) => {
            const login = await models.login.findOne(
                {
                    where: {user},
                    include: [
                        {
                            model: models.colaborator,
                        }
                    ]
                },
            );

            if(!login) {
                return {error: true, message: 'Login não existe!'};
            }

            const passwordMatch = await bcrypt.compare(password, login.password);

            if(!passwordMatch) {
                return {error: true, message: 'A senha está incorreta'};
            }

            const token = jwt.sign({
                userId: login.id,
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: '30d'
            });
            
            
            return {error: false,  message: 'Logado com sucesso!', token, details: login};
        },
        assignColaboratorToUser: async(_, {userId, colaboratorId}) => {
            const login =  await models.login.update({colaborator_id: colaboratorId}, {where: {id: userId}});

            if(!login) {
                return {error: true, message: 'Login não existe!'};
            }

            const user = await models.login.findByPk(userId);

            return user;
        }
    },
}