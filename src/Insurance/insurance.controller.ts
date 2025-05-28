import { Request, Response } from "express";
import {
    createInsuranceService,
    getInsuranceByIdService,
    getInsurancesByCarIdService,
    getInsurancesByProviderService,
    getAllInsurancesService
} from "./insurance.service";

// Create insurance
export const createInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceData = req.body;
        const insurance = await createInsuranceService(insuranceData);
        res.status(201).json({ message: "Insurance created", data: insurance });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to create insurance", message: error.message });
    }
};

// Get insurance by ID
export const getInsuranceByIdController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.insuranceId);
        const insurance = await getInsuranceByIdService(id);
        if (!insurance) {
            res.status(404).json({ message: `Insurance with ID ${id} not found` });
            return
        }
        res.status(200).json({ message: "Insurance found", data: insurance });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to get insurance", message: error.message });
    }
};

// Get insurances by car ID
export const getInsurancesByCarIdController = async (req: Request, res: Response) => {
    try {
        const carId = Number(req.params.carId);
        const insurances = await getInsurancesByCarIdService(carId);
        res.status(200).json({ message: `Insurances for car ID ${carId}`, data: insurances });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to get insurances by car ID", message: error.message });
    }
};

// Get insurances by provider
export const getInsurancesByProviderController = async (req: Request, res: Response) => {
    try {
        const provider = req.params.provider;
        const insurances = await getInsurancesByProviderService(provider);
        res.status(200).json({ message: `Insurances from provider: ${provider}`, data: insurances });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to get insurances by provider", message: error.message });
    }
};

// Get all insurances
export const getAllInsurancesController = async (_req: Request, res: Response) => {
    try {
        const insurances = await getAllInsurancesService();
        res.status(200).json({ message: "All insurances", data: insurances });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to get all insurances", message: error.message });
    }
};
