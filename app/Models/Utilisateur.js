// utilisateur.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Role from './Role.js'; // Assuming Role model file name

const Utilisateur = sequelize.define('Utilisateur', {
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Please enter a first name' },
        },
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Please enter a last name' },
        },
    },
    date_de_naissance: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Please enter a birthday' },
        },
    },
    telephone: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'Please enter a phone' },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: 'Please enter an email' },
            isEmail: { msg: 'Please enter a valid email' },
        },
    },
    mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Please enter a password' },
            len: { args: [6], msg: 'Minimum password length is 6 characters' },
        },
    },
}, {
    timestamps: false, // Disable createdAt and updatedAt
});

// Define relationship between Utilisateur and Role
Utilisateur.belongsTo(Role, { foreignKey: 'roleId' }); // Assuming Utilisateur belongs to Role

export default Utilisateur;
