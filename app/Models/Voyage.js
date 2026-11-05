// models/Voyage.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Voyage = sequelize.define('Voyage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  de: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  a: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  heure: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  
});

export default Voyage;
