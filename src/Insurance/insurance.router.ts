import { Express } from 'express';


const insurance = (app: Express) => {

    // Get Insurance by insuranceId
    app.route('/insurance/:insuranceId').get(
        (req, res) => {
            const insuranceId = req.params.insuranceId;
            // Logic to get insurance by ID
            res.send(`Insurance details for ID: ${insuranceId}`);
        }
    );

    // Get insurance by carrId
    app.route('/insurance/car/:carId').get(
        (req, res) => {
            const carId = req.params.carId;
            // Logic to get insurance by car ID
            res.send(`Insurance details for car ID: ${carId}`);
        }
    );

    // Get insurance by  insurance provider
    app.route('/insurance/provider/:provider').get(
        (req, res) => {
            const provider = req.params.provider;
            // Logic to get insurance by provider
            res.send(`Insurance details for provider: ${provider}`);
        }
    );

    //Get all insurances
    app.route('/insurance').get(
        (req, res) => {
            // Logic to get all insurances
            res.send('List of all insurances');
        }
    );
    
    //Create an insurance
    app.route('/insurance').post(
        (req, res) => {
            const insuranceData = req.body;
            // Logic to create an insurance
            res.status(201).send(`Insurance created with data: ${JSON.stringify(insuranceData)}`);
        }
    );
}

