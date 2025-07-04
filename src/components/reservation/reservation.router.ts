import { Express } from "express";
import {
    createReservationController,
    getReservationByCustomerIdController,
    getReservationByCarIdController,
    getReturnedCarsController,
    getCurrentlyReservedCarsController,
    getCurrentlyReservedCarsByCustomerController, getReservationByUserIdController, getAllReservationsController
} from "./reservation.controller";

const reservationRoute = (app: Express) => {
    app.route("/reservation").post(createReservationController);
    app.route("/reservation").get(getAllReservationsController)
    app.route("/reservation/customer/:customerId").get(getReservationByCustomerIdController);
    app.route("/reservation/user/:userId").get(getReservationByUserIdController);
    app.route("/reservation/car/:carId").get(getReservationByCarIdController);
    app.route("/reservation/returned").get(getReturnedCarsController);
    app.route("/reservation/current").get(getCurrentlyReservedCarsController);
    app.route("/reservation/customer/:customerName/current").get(getCurrentlyReservedCarsByCustomerController);
};

export default reservationRoute;
