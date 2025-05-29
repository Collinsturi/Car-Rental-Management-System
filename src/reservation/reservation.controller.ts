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

    if(Array.isArray(data) && data.length > 0)
    {
        res.status(200).json({
            message: "Reservation created successfully.",
            payload: data
        })

        return;
    }
    
    res.status(200)
    .json({
        message: "Reservation was not created successfully."
    })
}

export const getReservationByCustomerIdController = async (req: Request, res: Response) => {
    const customerId = Number(req.params.customerId);
    const data = await getReservationByCustomerIdService(customerId);

    if(Array.isArray(data) && data.length > 0){
        res.status(200).json({ message: "Reservations for customer", data });
    }

    res.status(200)
    .json({
        message: "No reservations for customer was found"
    })
};

export const getReservationByCarIdController = async (req: Request, res: Response) => {
    const carId = Number(req.params.carId);
    const data = await getReservationByCarIdService(carId);

    if(Array.isArray(data) && data.length > 0){
        res.status(200).json({ message: "Reservations for car", data });
    }

    res.status(200)
    .json({
        message: `No reservations were found for car id ${carId}`
    })
};

export const getReturnedCarsController = async (_req: Request, res: Response) => {
    const data = await getReturnedCarsService();

    if(Array.isArray(data) && data.length > 0){
        res.status(200).json({ message: "Returned cars", data });
    }

    res.status(200)
    .json({
        message: "There are no returned cars."
    })
};

export const getCurrentlyReservedCarsController = async (_req: Request, res: Response) => {
    const data = await getCurrentlyReservedCarsService();

    if(Array.isArray(data) && data.length > 0){
        res.status(200).json({ message: "Currently reserved cars", data });
        return;
    }

    res.status(200)
    .json({
        message: `No currently reserved cars`
    })
};

export const getCurrentlyReservedCarsByCustomerController = async (req: Request, res: Response) => {
    const customerName = req.params.customerName;
    const data = await getCurrentlyReservedCarsByCustomerService(customerName);

    if(Array.isArray(data) && data.length > 0){
        res.status(200).json({ message: "Currently reserved cars by customer", data });
        return;
    }

    res.status(200)
    .json({
        message: `There are no currently reserved cars for user ${customerName}`
    })
};
