import { Express } from "express";
import {
    createInsuranceController,
    getInsuranceByIdController,
    getInsurancesByCarIdController,
    getInsurancesByProviderController,
    getAllInsurancesController
} from "./insurance.controller";

const insurance = (app: Express) => {
    app.route("/insurance").post(createInsuranceController);                   // Create insurance
    app.route("/insurance/:insuranceId").get(getInsuranceByIdController);      // Get insurance by ID
    app.route("/insurance/car/:carId").get(getInsurancesByCarIdController);    // Get by car ID
    app.route("/insurance/provider/:provider").get(getInsurancesByProviderController); // Get by provider
    app.route("/insurance").get(getAllInsurancesController);                   // Get all insurances
};

export default insurance;
