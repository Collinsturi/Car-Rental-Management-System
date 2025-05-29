import { Express } from "express";
import {
    getReservationByCustomerIdController,
    getReservationByCarIdController,
    getReturnedCarsController,
    getCurrentlyReservedCarsController,
    getCurrentlyReservedCarsByCustomerController
} from "./reservation.controller";

const reservation = (app: Express) => {
    app.route("/reservation").post(createReservationController);
    app.route("/reservation/customer/:customerId").get(getReservationByCustomerIdController);
    app.route("/reservation/car/:carId").get(getReservationByCarIdController);
    app.route("/reservation/returned").get(getReturnedCarsController);
    app.route("/reservation/current").get(getCurrentlyReservedCarsController);
    app.route("/reservation/customer/:customerId/current").get(getCurrentlyReservedCarsByCustomerController);
};

export default reservation;
