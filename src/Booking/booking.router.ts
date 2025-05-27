import { Express } from 'express';


const booking = (app: Express) => {

    //Create booking
    app.route('/booking').post(
        (req, res) => {
            const bookingData = req.body;
            // Logic to create a booking
            res.status(201).send(`Booking created with data: ${JSON.stringify(bookingData)}`);
        }
    )



    //GetBooking By BookingID
    app.route('/booking/:bookingId').get(
        (req, res) => {
            const bookingId = req.params.bookingId;
            res.send(`Booking details for ID: ${bookingId}`);
        }
    )  


    //GetBooking by CardId
    app.route('/booking/card/:cardId').get(
        (req, res) => {
        const cardId = req.params.cardId;
        res.send(`Booking details for card ID: ${cardId}`);
        }
    )
     
    //Get booking by customerId
    app.route('/booking/customer/:customerId').get(
        (req, res) => {
        const customerId = req.params.customerId;
        res.send(`Booking details for customer ID: ${customerId}`);
        }
    )

    //Get all bookings 
    app.route('/booking').get(
        (req, res) => {
            res.send('List of all bookings');
        }
    )
}





