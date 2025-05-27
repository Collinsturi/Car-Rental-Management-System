import { Express } from 'express';

const payment = (app: Express) => {
    //Get payment by paymentId
    app.route('/payment/:paymentId').get(
        (req: any, res: any) => {
            const paymentId = req.params.paymentId;
            // Logic to get payment by ID
            res.send(`Payment details for ID: ${paymentId}`);
        }
    );
    
    //get payment by bookingId
    app.route('/payment/booking/:bookingId').get(
        (req: any, res: any) => {
            const bookingId = req.params.bookingId;
            // Logic to get payment by booking ID
            res.send(`Payment details for booking ID: ${bookingId}`);
        }
    );

}

