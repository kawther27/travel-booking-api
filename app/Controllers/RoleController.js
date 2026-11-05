import asyncHandler from "express-async-handler";
import Role from "../Models/Role.js";
import { validationResult } from "express-validator";
import { check } from "express-validator";

// Validation middleware for CreateRole route
const validateCreateRole = [
  check("role").notEmpty().withMessage("Role name is required"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
const CreateRole = [
  validateCreateRole,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { role } = req.body;

    // Check if role already exists by name
    const existingRole = await Role.findOne({
      where: {
        role: role,
      },
    });

    if (existingRole) {
      return res
        .status(400)
        .json({ status: "fail", message: "Role already exists" });
    }

    try {
      const newRole = await Role.create({
        role: role, // Ensure that the role key is set properly here
      });
      res.status(201).json(newRole);
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  }),
];

const GetAllRole = asyncHandler(async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(201).json(roles);
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
});

const deleteRole = asyncHandler(async (req, res) => {
  try {
    const role = await Role.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(201).json(role);
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
});

export { CreateRole, GetAllRole, deleteRole };
