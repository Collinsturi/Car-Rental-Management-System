import express from 'express';
import carRouter from './components/car/car.router'
import locationRouter from './components/location/location.router';
import customerRoute from './components/customer/customer.route'
import bookingRoute from './components/Booking/booking.router';
import paymentRouter from './components/payment/payment.router';
import maintenanceRouter from './components/maintainance/maintainance.router';
import { sendEmail } from './communication/mailer';
import reservationRoute from './components/reservation/reservation.router';
import insuranceRoute from './components/Insurance/insurance.router';

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

app.route("/").get(
    async (req, res) => {
        try {
            // You need to define user and verificationCode or replace them with actual values
            await sendEmail(
                "cmachuka70@gmail.com",
                "Verify your account",
                `Hello collins, your verification code is: 123456`,
                `<div>
                <h2>Hello Moturi,</h2>
                <p>Your verification code is: <strong>123456</strong></p>
                 <p>Enter this code to verify your account.</p>
                </div>`
            );
            res.status(200).send("Verification email sent.");
        } catch (emailError) {
            console.error("Failed to send registration email:", emailError);
            res.status(500).send("Failed to send registration email.");
        }
    }
)

app.listen(8081, () => {
    console.log('Server is running on port 8081');
});




