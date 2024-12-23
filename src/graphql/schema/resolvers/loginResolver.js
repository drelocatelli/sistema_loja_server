const Login = require('../../../models/Login');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    Mutation: {
        login: async (_, {password}) => {
            const login = await Login.findOne();

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
                expiresIn: '2h'
            });

            return {error: false,  message: 'Logado com sucesso!', token};
        }
    },
}