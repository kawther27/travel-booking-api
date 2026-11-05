import JWt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import Utilisateur from "../Models/Utilisateur.js";
import Role from "../Models/Role.js";
import { validationResult } from "express-validator";
import { check } from "express-validator";

// Validation middleware for CreateUser route
const validateCreateUser = [
  check("prenom").notEmpty().withMessage("First name is required"),
  check("nom").notEmpty().withMessage("Last name is required"),
  check("date_de_naissance")
    .notEmpty()
    .withMessage("Date of birth is required"),
  check("telephone").notEmpty().withMessage("Telephone number is required"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("mot_de_passe")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  check("roleId").notEmpty().withMessage("Role ID is required"),
];

// Validation middleware for UpdateUser route
const validateUpdateUser = [
  check("prenom").notEmpty().withMessage("First name is required"),
  check("nom").notEmpty().withMessage("Last name is required"),
  check("date_de_naissance")
    .notEmpty()
    .withMessage("Date of birth is required"),
  check("telephone").notEmpty().withMessage("Telephone number is required"),
  check("email").isEmail().withMessage("Invalid email format"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const handleErrors = (err) => {
  let errors = {
    prenom: "",
    nom: "",
    date_de_naissance: "",
    telephone: "",
    email: "",
    mot_de_passe: "",
    roleId: "",
  };

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const CreateUser = [
  validateCreateUser,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const {
      prenom,
      nom,
      date_de_naissance,
      telephone,
      email,
      mot_de_passe,
      roleId,
    } = req.body;

    // check if user exists by email
    const userExists = await Utilisateur.findOne({
      where: {
        email: email,
      },
    });

    if (userExists) {
      return res
        .status(401)
        .json({ status: "fail", message: "User already exists" });
    }

    // Check if role exists
    const roleExists = await Role.findOne({
      where: {
        id: parseInt(roleId),
      },
    });

    if (!roleExists) {
      return res
        .status(401)
        .json({ status: "fail", message: "Role not found" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    try {
      const userData = {
        prenom: prenom,
        nom: nom,
        date_de_naissance: date_de_naissance,
        telephone: telephone,
        email: email,
        mot_de_passe: hashedPassword,
        roleId: parseInt(roleId),
      };

      const newUser = await Utilisateur.create(userData);
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        id: newUser.id,
        email: newUser.email,
      });
    } catch (error) {
      res.status(401).json({ status: "fail", message: error.message });
    }
  }),
];

const UpdateUser = [
  validateUpdateUser,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { prenom, nom, date_de_naissance, telephone, email, id, roleId } =
      req.body;

    // check if user exists by ID
    const userExists = await Utilisateur.findOne({
      where: {
        id: parseInt(id),
      },
    });

    if (!userExists) {
      return res
        .status(401)
        .json({ status: "fail", message: "User not found" });
    }

    // Check if role exists
    const roleExists = await Role.findOne({
      where: {
        id: parseInt(roleId),
      },
    });

    if (!roleExists) {
      return res
        .status(401)
        .json({ status: "fail", message: "Role not found" });
    }

    try {
      const updatedUser = {
        prenom: prenom,
        nom: nom,
        date_de_naissance: date_de_naissance,
        telephone: telephone,
        email: email,
      };

      await Utilisateur.update(updatedUser, {
        where: {
          id: parseInt(id),
        },
      });

      const user = await Utilisateur.findOne({
        where: {
          email: email,
        },
      });

      res.status(201).json({
        status: "success",
        message: "User updated successfully",
        token: token,
        user: user,
      });
    } catch (error) {
      const errors = handleErrors(error);
      res.status(401).json({ status: "fail", message: errors });
    }
  }),
];

const GetAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await Utilisateur.findAll();
    res.status(200).json(users); // Use status 200 for success
  } catch (err) {
    console.error("Error: " + err.message);
    res.status(500).json({ status: "fail", message: err.message }); // Use status 500 for server errors
  }
});

const GetUserById = asyncHandler(async (req, res) => {
  try {
    const user = await Utilisateur.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (user) {
      res.status(200).json(user); // Use status 200 for success
    } else {
      res.status(404).json({ status: "fail", message: "User not found" }); // Use status 404 for resource not found
    }
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message }); // Use status 500 for server errors
  }
});

const LoginUser = asyncHandler(async (req, res) => {
  const { email, mot_de_passe } = req.body;

  // check is email
  if (!email.includes("@")) {
    res.status(401).json({ status: "invalid email or password..!!" });
  }

  // check length of password
  if (mot_de_passe < 8) {
    res.status(401).json({ status: "invalid email or password..!!" });
  }

  //  check if all fields exists
  if (!email || !mot_de_passe) {
    res.status(401).status("same thing is wrong with you..!!");
  }

  // check if user exists
  const user = await Utilisateur.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    res.status(401).json({ status: "invalid email or password..!!" });
  }

  // check if password is correct
  const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
  if (!isMatch) {
    res.status(401).json({ status: "invalid email or password..!!" });
  }

  // create token
  const token = JWt.sign({ id: user.roleId }, "admin", {
    expiresIn: 60 * 60 * 24,
  });

  res.status(201).json({ status: "success", token: token, user: user });
});

const DeleteUser = asyncHandler(async (req, res) => {
  try {
    const userexist = await Utilisateur.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });
    userexist.destroy();
    res.status(201).json({ status: "user deleted successfully" });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
});

export {
  GetAllUser,
  GetUserById,
  CreateUser,
  LoginUser,
  UpdateUser,
  DeleteUser,
};
