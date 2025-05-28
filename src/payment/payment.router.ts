import { Express } from "express";
import {
    getPaymentByIdController,
    getPaymentByBookingIdController
} from "./payment.controller";

const payment = (app: Express) => {
    app.route("/payment/:paymentId").get(getPaymentByIdController);              // Get by ID
    app.route("/payment/booking/:bookingId").get(getPaymentByBookingIdController); // Get by booking ID
};

export default payment;
