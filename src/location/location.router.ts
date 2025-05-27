import { Express } from 'express';

const location = (app: Express) => {
    // Get all locations
    app.route('/location').get(
        (req, res) => {
            // Logic to get all locations
            res.send('List of all locations');
        }
    );

}

