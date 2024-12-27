const authMiddleware = require('../../../middlewares/loginMiddleware');
const Colaborator = require('../../../models/Colaborator');

module.exports = {
    Query: {
        getColaborators: authMiddleware(async () => {
            return await Colaborator.findAll();
        }),
        getColaborator: authMiddleware(async (_, {id}) => {
            return await Colaborator.findByPk(id);
        })
    },

    Mutation: {
        createColaborator: authMiddleware(async (_, {input}) => {
            const newColaborator = await Colaborator.create(input);

            return newColaborator;
        }),

        updateColaborator: authMiddleware(async (_, {input}) => {
            // const colaborator = await Colaborator.findByPk(id);
            // // const collaborator = collaborators.find((collaborator) => collaborator.id === id);

            // if(!colaborator) {
            //     throw new Error('Collaborator not found!');
            // }

            // colaborator.name = name || colaborator.name;
            // colaborator.email = email || colaborator.email;
            // colaborator.role = role || colaborator.role;
            // colaborator.rg = rg || colaborator.rg;

            // await colaborator.save();
            
            // return colaborator;

            return null
        }),

        deleteColaborator: authMiddleware(async (_, {id}) => {
            const colaborator = await Colaborator.findByPk(id);

            if(!colaborator) {
                throw new Error('Collaborator not found!');
            }

            colaborator.deleted_at = new Date();
            await colaborator.save();
            return `Collaborator with ID ${id} deleted successfully.`;
        })
    }
}