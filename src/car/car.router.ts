import { Express } from 'express';

const cars = (app: Express) => {

    //Create a car
    app.route('/cars').post(
        (req, res) => {
            const carData = req.body;
            // Logic to create a new car
            res.status(201).send(`Car created with data: ${JSON.stringify(carData)}`);
        }
    );

    //Get car by card Id
    app.route('/cars/:carId').get(
        (req, res) => {
            const carId = req.params.carId;
            // Logic to get car by ID
            res.send(`Car details for ID: ${carId}`);
        }
    );


    // Get Car by car model
    app.route('/cars/model/:model').get(
        (req, res) => {
            const model = req.params.model;
            // Logic to get car by model
            res.send(`Car details for model: ${model}`);
        }
    );

    //Get car by year
    app.route('/cars/year/:year').get(
        (req, res) => {
            const year = req.params.year;
            // Logic to get car by year
            res.send(`Car details for year: ${year}`);
        }
    );

    // Get all available cars
    app.route('/cars/available').get(
        (req, res) => {
            // Logic to get all available cars
            res.send('List of all available cars');
        }
    );


    // Get all cars in A certain location
    app.route('/cars/location/:location').get(
        (req, res) => {
            const location = req.params.location;
            // Logic to get all cars in a certain location
            res.send(`List of all cars in location: ${location}`);
        }
    );

}



