

const maintenance = (app: any) => {
    // Get maintenance by maintenanceId
    app.route('/maintenance/:maintenanceId').get(
        (req: any, res: any) => {
            const maintenanceId = req.params.maintenanceId;
            // Logic to get maintenance by ID
            res.send(`Maintenance details for ID: ${maintenanceId}`);
        }
    );
    
    // Get maintenance by carId
    app.route('/maintenance/car/:carId').get(
        (req: any, res: any) => {
            const carId = req.params.carId;
            // Logic to get maintenance by car ID
            res.send(`Maintenance details for car ID: ${carId}`);
        }
    );

}
