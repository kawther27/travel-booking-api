// models/Billet.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Utilisateur from './Utilisateur.js'; // Assuming Utilisateur model file name
import Voyage from './Voyage.js'; // Assuming Voyage model file name

const Billet = sequelize.define('Billet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  prix: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Define associations
Billet.belongsTo(Utilisateur, { foreignKey: 'utilisateurId' }); // Each Billet belongs to one Utilisateur
Billet.belongsTo(Voyage, { foreignKey: 'voyageId' }); // Each Billet belongs to one Voyage

export default Billet;
