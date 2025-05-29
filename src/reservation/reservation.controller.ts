import { Request, Response } from "express";
import {
    getReservationByCustomerIdService,
    getReservationByCarIdService,
    getReturnedCarsService,
    getCurrentlyReservedCarsService,
    getCurrentlyReservedCarsByCustomerService,
    createReservationService,
} from "./reservation.service";

export const createReservationController = async (req: Request, res: Response) => {
    const reservation  = req.body;

    const data = await createReservationService(reservation);

    res.status(200).json({
        message: "Reservation created successfully.",
        payload: data
    })
}

export const getReservationByCustomerIdController = async (req: Request, res: Response) => {
    const customerId = Number(req.params.customerId);
    const data = await getReservationByCustomerIdService(customerId);
    res.status(200).json({ message: "Reservations for customer", data });
};

export const getReservationByCarIdController = async (req: Request, res: Response) => {
    const carId = Number(req.params.carId);
    const data = await getReservationByCarIdService(carId);
    res.status(200).json({ message: "Reservations for car", data });
};

export const getReturnedCarsController = async (_req: Request, res: Response) => {
    const data = await getReturnedCarsService();
    res.status(200).json({ message: "Returned cars", data });
};

export const getCurrentlyReservedCarsController = async (_req: Request, res: Response) => {
    const data = await getCurrentlyReservedCarsService();
    res.status(200).json({ message: "Currently reserved cars", data });
};

export const getCurrentlyReservedCarsByCustomerController = async (req: Request, res: Response) => {
    const customerId = Number(req.params.customerId);
    const data = await getCurrentlyReservedCarsByCustomerService(customerId);
    res.status(200).json({ message: "Currently reserved cars by customer", data });
};
