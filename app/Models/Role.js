// Role.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Role = sequelize.define('Role', {
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Utilisateur', // Default value for roles
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt
});

export default Role;
