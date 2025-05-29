import { Express } from "express";
import {
    getPaymentByIdController,
    getPaymentByBookingIdController,
    createPaymentcontroller
} from "./payment.controller";

const paymentRouter = (app: Express) => {
    app.route("/payment").post(createPaymentcontroller);
    app.route("/payment/:paymentId").get(getPaymentByIdController);              // Get by ID
    app.route("/payment/booking/:bookingId").get(getPaymentByBookingIdController); // Get by booking ID
};

export default paymentRouter;
