import express from 'express';
import carRouter from './components/car/car.router'
import locationRouter from './components/location/location.router';
import customerRoute from './components/customer/customer.route'
import bookingRoute from './components/Booking/booking.router';
import paymentRouter from './components/payment/payment.router';
import maintenanceRouter from './components/maintainance/maintainance.router';
import reservationRoute from './components/reservation/reservation.router';
import insuranceRoute from './components/Insurance/insurance.router';
import userRoute from './Authentication/authentication.router';


const initializeApp = () => {
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
    userRoute(app);
}

const app = initializeApp();
export default app;



