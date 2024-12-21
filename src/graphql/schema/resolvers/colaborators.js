const Colaborator = require('../../../models/Colaborator');

module.exports = {
    Query: {
        getColaborators: async () => {
            return await Colaborator.findAll();
        },
        getColaborator: async (_, {id}) => {
            return await Colaborator.findByPk(id);
        }
    },

    Mutation: {
        createColaborator: async (_, {name, email, role, rg}) => {
            const newColaborator = await Colaborator.create({
                name,
                email,
                role,
                rg
            });

            return newColaborator;
        },

        updateColaborator: async (_, {id, name, email, role, rg}) => {
            const colaborator = await Colaborator.findByPk(id);
            // const collaborator = collaborators.find((collaborator) => collaborator.id === id);

            if(!colaborator) {
                throw new Error('Collaborator not found!');
            }

            colaborator.name = name || colaborator.name;
            colaborator.email = email || colaborator.email;
            colaborator.role = role || colaborator.role;
            colaborator.rg = rg || colaborator.rg;

            await colaborator.save();
            
            return colaborator;
        },

        deleteColaborator: async (_, {id}) => {
            const collaborator = await Colaborator.findByPk(id);

            if(!collaborator) {
                throw new Error('Collaborator not found!');
            }

            await collaborator.destroy();
            return `Collaborator with ID ${id} deleted successfully.`;
        }
    }
}