import { Express } from "express";
import { getAllLocationsController, createLocationController } from "./location.controller";


const locationRouter = (app: Express) => {
    app.route("/location").post(createLocationController);
    app.route("/location").get(getAllLocationsController);
};

export default locationRouter;
