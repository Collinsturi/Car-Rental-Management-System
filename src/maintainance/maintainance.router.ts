import { Express } from "express";
import {
    getMaintenanceByIdController,
    getMaintenanceByCarIdController,
    createMaintenanceController
} from "./maintainance.controller";

const maintenanceRouter = (app: Express) => {
    app.route("/maintenance").post(createMaintenanceController);
    app.route("/maintenance/:maintenanceId").get(getMaintenanceByIdController);     // Get by ID
    app.route("/maintenance/car/:carId").get(getMaintenanceByCarIdController);      // Get by car ID
};

export default maintenanceRouter;
