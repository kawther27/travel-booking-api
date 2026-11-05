import JWt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { check, validationResult } from "express-validator";
import Role from "../Models/Role.js";
import Admin from "../Models/Admin.js";

const validateCreateAdmin = [
  check("prenom").notEmpty().withMessage("First name is required"),
  check("nom").notEmpty().withMessage("Last name is required"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("mot_de_passe")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  check("roleId").notEmpty().withMessage("Role ID is required"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

const handleErrors = (err) => {
  let errors = { prenom: "", nom: "", email: "", mot_de_passe: "", roleId: "" };

  if (err.message.includes("Admin validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const GetAllAdmin = asyncHandler(async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(201).json(admins);
  } catch (err) {
    console.error("Error: " + err.message);
    res.status(401).json({ status: "fail", message: err.message });
  }
});

const CreateAdmin = [
  validateCreateAdmin,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { prenom, nom, email, mot_de_passe, roleId } = req.body;

    try {
      const role = await Role.findByPk(roleId);
      if (!role) {
        res.status(401).json({ status: "fail", message: "Role not found" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

      const newAdmin = await Admin.create({
        prenom: prenom,
        nom: nom,
        email: email,
        mot_de_passe: hashedPassword,
        roleId: roleId,
      });

      res.status(201).json({ status: "admin created successfully", email: newAdmin.email });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(401).json({ status: "fail", message: errors });
    }
  }),
];

const LoginAdmin = asyncHandler(async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email: email }, include: Role });
    if (!admin) {
      res.status(401).json({ status: "fail", message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
    if (!isMatch) {
      res.status(401).json({ status: "fail", message: "Invalid email or password" });
      return;
    }

    const token = JWt.sign({ id: admin.roleId }, "admin", { expiresIn: 60 * 60 * 24 });

    res.status(201).json({ status: "success", token: token, user: admin });
  } catch (err) {
    res.status(401).json({ status: "fail", message: "Invalid email or password" });
  }
});

const UpdateAdmin = asyncHandler(async (req, res) => {
  const { prenom, nom, email, id, roleId } = req.body;

  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      res.status(401).json({ status: "fail", message: "Admin not found" });
      return;
    }

    const updatedAdmin = {
      prenom: prenom,
      nom: nom,
      email: email,
      RoleId: roleId, // Update role ID
    };
    await admin.update(updatedAdmin);

    const token = JWt.sign({ id: roleId }, "admin", { expiresIn: 86400 * 7 });

    res.status(201).json({ status: "user updated successfully", token: token, user: admin });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(401).json({ status: "fail", message: errors });
  }
});

export { GetAllAdmin, CreateAdmin, LoginAdmin, UpdateAdmin };
