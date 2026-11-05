// admin.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Role from "./Role.js";

const Admin = sequelize.define(
  "Admin",
  {
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Please add prenom" },
      },
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Please add nom" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "Please add an email" },
        isEmail: { msg: "Please add a valid email" },
      },
    },
    mot_de_passe: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Please add a password" },
        len: { args: [8], msg: "Minimum password length is 8 characters" },
      },
    },
  },
  {
    timestamps: false, // Disable createdAt and updatedAt
  }
);

// Define relationship between Admin and Role
Admin.belongsTo(Role, { foreignKey: "roleId" }); // Assuming Admin belongs to Role

export default Admin;
