const Login = require('../../../models/Login');
const bcrypt = require('bcrypt');

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
            
            return {error: false,  message: 'Logado com sucesso!', data: login};
        }
    },
}