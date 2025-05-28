import { Request, Response } from 'express';
import {createCarService, getAllAvailableCarsService, getCarByIdService, getCarsByCarModelService, getAllCarsInACertainLocationService} from "./car.service";

//Create a car entry
export const createCarController = async(req: Request, res: Response) => {
  try {
        const carData = req.body;

        const createdCar = await createCarService(carData);

        if (!createdCar) {
            res.status(400).json({
                message: "Car was not created.",
            });
            return;
        }

        res.status(201).json({
            message: 'Car created successfully',
            data: createdCar,
        });
    } catch (error: any) {
        res.status(500).json({
            error: 'Failed to create car',
            message: error.message,
        });
    }
};

// Get car by ID
export const getCarByIdController = async(req: Request, res: Response) => {
   try {
        const carId = Number(req.params.carId);

        const car = await getCarByIdService(carId);

        if (!car) {
            res.status(404).json({
                message: `Car with ID '${carId}' not found.`,
            });

            return;
        }

        res.status(200).json({
            message: `Car details for ID: ${carId}`,
            data: car,
        });
    } catch (error: any) {
        res.status(500).json({
            error: 'Failed to retrieve car',
            message: error.message,
        });
    }
}


// Get car by model
export const getCarByModel = async(req: Request, res: Response) => {
    try {
        const model = req.params.model;

        const cars = await getCarsByCarModelService(model);

        res.status(200).json({
            message: `Cars with model: ${model}`,
            data: cars,
        });
    } catch (error: any) {
        res.status(500).json({
            error: 'Failed to retrieve cars by model',
            message: error.message,
        });
    }
}

// // Get car by year
// export const getCarByYear = async(req: Request, res: Response) => {
//     try {
//         const year = req.params.year;

//         // Here you would typically call a service or repository to fetch the car by year
//         // For example: const car = await carService.getCarByYear(year);

//         // Simulating a successful response
//         res.status(200).json({ message: `Car details for year: ${year}` });

//     } catch (Error: any) {
//         res.status(500).json({ error: 'Failed to retrieve car', message: Error.message });
//     }
// }

//Get all available cars
export const getAllAvailableCars = async(req: Request, res: Response) => {
   try {
        const cars = await getAllAvailableCarsService();

        res.status(200).json({
            message: 'List of all available cars',
            data: cars,
        });
    } catch (error: any) {
        res.status(500).json({
            error: 'Failed to retrieve available cars',
            message: error.message,
        });
    }
}

// Get all cars in a certain location
export const getCarsByLocation = async(req: Request, res: Response) => {
   try {
        const location = req.params.location;

        const cars = await getAllCarsInACertainLocationService(location);

        res.status(200).json({
            message: `List of all cars in location: ${location}`,
            data: cars,
        });
    } catch (error: any) {
        res.status(500).json({
            error: 'Failed to retrieve cars by location',
            message: error.message,
        });
    }
}

