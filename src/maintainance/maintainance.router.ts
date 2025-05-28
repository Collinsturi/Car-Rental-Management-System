import { Express } from "express";
import {
    getMaintenanceByIdController,
    getMaintenanceByCarIdController
} from "./maintainance.controller";

const maintenance = (app: Express) => {
    app.route("/maintenance/:maintenanceId").get(getMaintenanceByIdController);     // Get by ID
    app.route("/maintenance/car/:carId").get(getMaintenanceByCarIdController);      // Get by car ID
};

export default maintenance;
