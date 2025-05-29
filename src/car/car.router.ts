import { Express } from 'express';
import {
    getCarByModel,
    getAllAvailableCars,
    getCarsByLocation,
    createCarController,
    getCarByIdController
} from './car.controller';

const carRouter = (app: Express) => {
    // Create a car
    app.route('/cars').post(createCarController);

    // Get car by car ID
    app.route('/cars/:carId').get(getCarByIdController);

    // Get car by model
    app.route('/cars/model/:model').get(getCarByModel);

    // Get all available cars
    app.route('/cars/available').get(getAllAvailableCars);

    // Get all cars in a certain location
    app.route('/cars/location/:location').get(getCarsByLocation);
};

export default carRouter;
