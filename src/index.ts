import express from 'express';
import carRouter from './car/car.router'
import locationRouter from './location/location.router';
import customerRoute from './customer/customer.route'
import reservationRoute from "./reservation/reservation.router"
import bookingRoute from './Booking/booking.router';
import paymentRouter from './payment/payment.router';
import maintenanceRouter from './maintainance/maintainance.router';
import insuranceRoute from './Insurance/insurance.router';

const app = express();
app.use(express.json());

//Application Routes
carRouter(app);
locationRouter(app);
customerRoute(app);
reservationRoute(app);
bookingRoute(app);
paymentRouter(app)
maintenanceRouter(app)
insuranceRoute(app);


app.listen(8081, () => {
    console.log('Server is running on port 8081');
});




