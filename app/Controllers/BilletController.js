import asyncHandler from "express-async-handler";
import Utilisateur from "../Models/Utilisateur.js";
import Voyage from "../Models/Voyage.js";
import Billet from "../Models/Billet.js";
import { validationResult } from "express-validator";
import { check } from "express-validator";

const validateCreateTicket = [
  check("prix").notEmpty().withMessage("Price is required"),
  check("voyageId").notEmpty().withMessage("Voyage ID is required"),
  check("utilisateurId").notEmpty().withMessage("User ID is required"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const CreateTicket = [
  validateCreateTicket,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { prix, voyageId, utilisateurId } = req.body;

    // check if user exists
    const userExists = await Utilisateur.findOne({
      where: {
        id: parseInt(utilisateurId),
      },
    });
    if (!userExists) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    // check if travel exists
    const travelExists = await Voyage.findOne({
      where: {
        id: parseInt(voyageId),
      },
    });
    if (!travelExists) {
      return res
        .status(404)
        .json({ status: "fail", message: "Travel not found" });
    }

    try {
      const ticketData = {
        prix: prix,
        voyageId: voyageId,
        utilisateurId: utilisateurId,
      };
      const ticket = await Billet.create(ticketData);
      return res
        .status(201)
        .json({ status: "success", message: "Ticket created successfully" });
    } catch (err) {
      return res.status(500).json({ status: "fail", message: err.message });
    }
  }),
];
const GetAllTicket = asyncHandler(async (req, res) => {
  try {
    const tickets = await Billet.findAll();
    res.status(201).json(tickets);
  } catch (err) {
    console.error("Error: " + err.message);
    res.status(401).json({ status: "fail", message: err.message });
  }
});

const GetOneTicket = asyncHandler(async (req, res) => {
  // check if ticket exists
  const ticketExists = await Billet.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!ticketExists) {
    res.status(401).json({ status: "This ticket not found" });
  }

  try {
    const ticket = await Billet.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(201).json({ status: "success", ticket });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
});

const UpdateTicket = asyncHandler(async (req, res) => {
  const { prix, voyage, utilisateur } = req.body;

  if (!prix || !utilisateur || !voyage) {
    res.status(401).json({ status: "Please add all fields" });
    return;
  }

  // check if user exists
  const userExists = await Utilisateur.findOne({
    where: {
      id: parseInt(utilisateur),
    },
  });
  if (!userExists) {
    res.status(401).json({ status: "User not found" });
    return;
  }

  // check if travel exists
  const travelExists = await Voyage.findOne({
    where: {
      id: parseInt(voyage),
    },
  });
  if (!travelExists) {
    res.status(401).json({ status: "Travel not found" });
    return;
  }

  try {
    const ticketData = {
      prix: prix,
      voyage: voyage,
      utilisateur: utilisateur,
    };
    const ticket = await Billet.update(ticketData, {
      where: {
        id: parseInt(req.params.id),
      },
    });
    res
      .status(201)
      .json({ status: "success", message: "Ticket updated successfully" });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
});

const DeleteTicket = asyncHandler(async (req, res) => {
  // check if ticket exists
  const ticketExists = await Billet.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!ticketExists) {
    res.status(401).json({ status: "This ticket not found" });
  }

  try {
    await ticketExists.destroy();
    res.status(201).json("Ticket deleted");
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
});

export { GetAllTicket, GetOneTicket, CreateTicket, UpdateTicket, DeleteTicket };
