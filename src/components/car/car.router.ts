import { Express } from 'express';
import {
    getCarByModel,
    getAllAvailableCars,
    getCarsByLocation,
    createCarController,
    getCarByIdController,
    updateCarsController
} from './car.controller';
import { adminRoleAuth, bothRoleAuth } from '../../middleware/bearAuth';

const carRouter = (app: Express) => {
    // Create a car
    app.route('/cars').post(
        // adminRoleAuth,
        createCarController);

    // Get car by car ID
    app.route('/cars/find/:carId').get(
        // bothRoleAuth,
        getCarByIdController);

    // Get car by model
    app.route('/cars/model/:model').get(
        // bothRoleAuth,
        getCarByModel);

    // Get all available cars
    app.route('/cars/available').get(
        // bothRoleAuth,
        getAllAvailableCars);

    // Get all cars in a certain location
    app.route('/cars/location/:location').get(
        // bothRoleAuth,
        getCarsByLocation);


    app.route('/cars/').patch(
        // adminRoleAuth,
        updateCarsController
    )
};

export default carRouter;
