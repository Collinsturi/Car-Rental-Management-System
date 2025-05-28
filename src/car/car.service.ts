import { eq } from "drizzle-orm";
import db from "../Drizzle/db"
import { CarTable, CarEntity, LocationTable } from "../Drizzle/schema"

//Create a car 
export const createCarService = async (carData: CarEntity) => {
    try {
        const [insertedCar] = await db.insert(CarTable).values(carData).returning();

        if(insertedCar) {
            return insertedCar;
        }

        throw new Error("There was an error with the database in creating the car");
    } catch (error: any) {
        throw new Error(`Failed to create car: ${error.message}`);
    }
}

// Get car by ID
export const getCarByIdService = async (id: number) => {
    try{
        const carDetails = await db.query.CarTable.findFirst({
            where: eq(CarTable.carID, id)
        })

        if(carDetails){
            return carDetails
        }

        throw new Error("There was an error with the retrieval of car by id '"+ id +"'.")        
    }catch(Error: any){
        return null;
    }
}

//Get car by car model
export const getCarsByCarModelService = async (model: string) => {
    try{
        const cars = await db.query.CarTable.findMany(
            {
              where: eq(CarTable.carModel, model)   
            }
        )

        if (cars && cars.length > 0) {
            return cars;
        }
        return [];

    }catch(error: any){
        throw new Error(`Error getting cars by model: ${error.message}`);
    }
}

//Get car by year
// export const getCarsByCarYear = async (year: Date) => {
//     try{
//         const cars = await db.query.CarTable.findMany(
//             {
//               where: eq(CarTable.year, year)
//             }
//         )

//         if (cars && cars.length > 0) {
//             return cars;
//         }
//         return [];

//     }catch(error: any){
//         throw new Error(`Error getting cars by model: ${error.message}`);
//     }
// }


//Get All available cars
export const getAllAvailableCarsService = async () => {
    try {
        const cars = await db.query.CarTable.findMany({
            where: eq(CarTable.availability, true)
        });

        return cars || [];
    } catch (error: any) {
        throw new Error(`Error getting available cars: ${error.message}`);
    }
}

 

//Get all cars in a certain location
export const getAllCarsInACertainLocationService = async (locationName: string) => {
    try {
        // Step 1: Get location ID by name
        const location = await db.query.LocationTable.findFirst({
            where: eq(LocationTable.locationName, locationName),
        });

        if (!location) {
            throw new Error(`Location '${locationName}' not found`);
        }

        // Step 2: Get cars by location ID
        const cars = await db.query.CarTable.findMany({
            where: eq(CarTable.locationID, location.locationID),
        });

        return cars || [];
    } catch (error: any) {
        throw new Error(`Error getting cars in location '${locationName}': ${error.message}`);
    }
}