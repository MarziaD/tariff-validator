"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { validateTariff, ValidationResult } from "../utils/validateTariff";
const router = express_1.default.Router();
router.post("/validate", (req, res) => {
    const tariff = req.body;
    try {
        const validationResult = tariff;
        if (validationResult.isValid) {
            res.status(200).json({
                message: "Tariff is valid",
            });
        }
        else {
            res.status(400).json({
                message: "Tariff validation failed",
                errors: validationResult.errors,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.default = router;
