import asyncHandler from "express-async-handler";
import Voyage from "../Models/Voyage.js";
import { validationResult } from "express-validator";
import { check } from "express-validator";

// Validation middleware for CreateTravel route
const validateCreateTravel = [
  check("de").notEmpty().withMessage("Departure location is required"),
  check("a").notEmpty().withMessage("Destination location is required"),
  check("date").notEmpty().withMessage("Date is required"),
  check("heure").notEmpty().withMessage("Time is required"),
  check("prix").notEmpty().withMessage("Price is required"),
];

// Validation middleware for UpdateTravel route
const validateUpdateTravel = [
  check("de").notEmpty().withMessage("Departure location is required"),
  check("a").notEmpty().withMessage("Destination location is required"),
  check("date").notEmpty().withMessage("Date is required"),
  check("heure").notEmpty().withMessage("Time is required"),
  check("prix").notEmpty().withMessage("Price is required"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const SearchTravel = asyncHandler(async (req, res) => {
  const { de, a, date } = req.params;
  const searchResults = await Voyage.findAll({
    where: {
      de: de,
      a: a,
      date: date,
    },
  });

  if (!searchResults.length) {
    res.status(401);
    throw new Error("This travel not found!");
  }

  res.status(201).json(searchResults);
});

const GetAllTravel = asyncHandler(async (req, res) => {
  try {
    const travels = await Voyage.findAll();
    res.status(201).json(travels);
  } catch (error) {
    res.status(401).json({ status: "fail" });
  }
});

const GetTravelById = asyncHandler(async (req, res) => {
  try {
    const travel = await Voyage.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!travel) {
      res.status(401).json({ status: "undefined travel" });
      return;
    }
    res.status(201).json(travel);
  } catch (error) {
    res.status(401).json({ status: "undefined travel" });
  }
});

const CreateTravel = [
  validateCreateTravel,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { de, a, date, heure, prix } = req.body;

    try {
      const voyageData = {
        de: de,
        a: a,
        date: date,
        heure: heure,
        prix: prix,
      };
      const createdTravel = await Voyage.create(voyageData);
      res.status(201).json(createdTravel);
    } catch (error) {
      res.status(400).json({ status: "failed to create travel" });
    }
  }),
];

const UpdateTravel = [
  validateUpdateTravel,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { de, a, date, heure, prix } = req.body;

    try {
      const travel = await Voyage.findOne({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!travel) {
        res.status(400).json({ status: "travel not found" });
        return;
      }

      const voyageData = {
        de: de,
        a: a,
        date: date,
        heure: heure,
        prix: prix,
      };

      const updatedTravel = await Voyage.update(voyageData, {
        where: { id: parseInt(req.params.id) },
      });
      const travelres = await Voyage.findOne({
        where: {
          id: parseInt(req.params.id),
        },
      });

      res.status(200).json(travelres);
    } catch (error) {
      res.status(401).json({ status: "failed to update travel" });
    }
  }),
];

const DeleteTravel = asyncHandler(async (req, res) => {
  const travel = await Voyage.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!travel) {
    res.status(401).json({ status: "undefined travel" });
    return;
  }
  try {
    const travelres = await Voyage.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });
    await travelres.destroy();
    res.status(201).json("Travel deleted");
  } catch (error) {
    res.status(401).json({ status: "failed to delete travel" });
  }
});

export {
  SearchTravel,
  GetAllTravel,
  GetTravelById,
  CreateTravel,
  UpdateTravel,
  DeleteTravel,
};
