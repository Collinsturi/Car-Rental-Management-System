import { Request, Response } from "express";
import {
    getMaintenanceByIdService,
    getMaintenanceByCarIdService,
    createMaintenanceService
} from "./maintainance.service";

export const createMaintenanceController = async (req: Request, res: Response) => {
    try{
        const maintainance = await createMaintenanceService(req.body);

        if(maintainance){
            res.status(200)
            .json({
                message: "Maintainance created",
                payload: maintainance
            })
        }

        res.status(500)
        .json({
            message: "There was an error creating a maintainance entry."
        })
    }catch(error: any){
         res.status(500)
        .json({
            message: "There was an error creating a maintainance entry."
        })
    }
}

// Get maintenance by maintenanceId
export const getMaintenanceByIdController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.maintenanceId);
        const maintenance = await getMaintenanceByIdService(id);

        if (!maintenance) {
            res.status(404).json({ message: `Maintenance record with ID ${id} not found` });
            return;
        }

        res.status(200).json({ message: "Maintenance found", data: maintenance });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch maintenance by ID", message: error.message });
    }
};

// Get maintenance by carId
export const getMaintenanceByCarIdController = async (req: Request, res: Response) => {
    try {
        const carId = Number(req.params.carId);
        const maintenances = await getMaintenanceByCarIdService(carId);

        res.status(200).json({ message: `Maintenances for car ID ${carId}`, data: maintenances });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch maintenances by car ID", message: error.message });
    }
};
