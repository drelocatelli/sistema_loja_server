const Login = require('../../../models/Login');
const bcrypt = require('bcrypt');

module.exports = {
    Query: {
        login: async (_, {password}) => {
            const login = await Login.findOne();

            if(!login) {
                return {error: true, message: 'Login não existe!'};
            }

            const passwordMatch = await bcrypt.compare(password, login.password);
            if(!passwordMatch) {
                return {error: true, message: 'Ocorreu um erro'};
            }
            
            return {error: false,  message: 'Logado com sucesso!', data: login};
        }
    },
}