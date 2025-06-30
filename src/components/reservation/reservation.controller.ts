import { Request, Response } from "express";
import {
    getReservationByCustomerIdService,
    getReservationByCarIdService,
    getReturnedCarsService,
    getCurrentlyReservedCarsService,
    getCurrentlyReservedCarsByCustomerService,
    createReservationService, getReservationByUserIdService
    , getAllReservationsService
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

export const getAllReservationsController = async (req: Request, res: Response) => {
    try {
        const reservations = await getAllReservationsService();

        if (Array.isArray(reservations) && reservations.length > 0) {
            res.status(200).json({message: "Reservations for customer", data: reservations})
        }

        res.status(200).json({message: "Reservations were not found"})
    }catch (error: any) {
        res.status(500).json({message: error.message})
    }
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

export const getReservationByUserIdController = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const data = await getReservationByUserIdService(userId);

    if(Array.isArray(data) && data.length > 0){
        res.status(200).json({ message: "Reservations for user", data });
    }

    res.status(200)
    .json({
        message: "No reservations for user was found"
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
