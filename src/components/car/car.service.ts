import { eq } from "drizzle-orm";
import db from "../../Drizzle/db"
import { CarTable, CarEntity, LocationTable } from "../../Drizzle/schema"

//Create a car 
export const createCarService = async (carData: CarEntity) => {
    try {
        const [insertedCar] = await db.insert(CarTable).values(carData).returning();

        if(insertedCar) {
            return insertedCar;
        }

        throw new Error("There was an error with the database in creating the car");
    } catch (error: any) {
        console.log(error);
        return [];
    }
}

// Get car by ID
export const getCarByIdService = async (id: number) => {
    try{
        const carDetails = await db.select()
            .from(CarTable)
            .rightJoin(LocationTable as any, on => eq(CarTable.locationID, LocationTable.locationID))
            .where(eq(CarTable.carID, id))
        
        if(carDetails){
            return carDetails
        }

        throw new Error("There was an error with the retrieval of car by id '"+ id +"'.")        
    }catch(Error: any){
        console.log(Error)
        return [];
    }
}

//Get car by car model
export const getCarsByCarModelService = async (model: string) => {
    try{
        const cars = await db.select()
            .from(CarTable)
            .rightJoin(LocationTable as any, on => eq(CarTable.locationID, LocationTable.locationID))
            .where(eq(CarTable.carModel, model))


        if (cars && cars.length > 0) {
            return cars;
        }

        throw new Error(`Error getting cars by model: ${model}`);
    }catch(error: any){
        console.log(error)
        return[]
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
        const cars = await db.select()
            .from(CarTable)
            .rightJoin(LocationTable as any, on => eq(CarTable.locationID, LocationTable.locationID))
            .where(eq(CarTable.availability, true))

        if(cars) return cars;

        throw new Error(`Error getting available cars`);
    } catch (error: any) {
        console.log(error);
        return[]
    }
}

 

//Get all cars in a certain location
export const getAllCarsInACertainLocationService = async (locationName: string) => {
    try {
        // Get location ID by name
        const location = await db.query.LocationTable.findFirst({
            where: eq(LocationTable.locationName, locationName),
        });

        if (location) {
            // Get cars by location ID
            const cars = await db.query.CarTable.findMany({
                where: eq(CarTable.locationID, location.locationID),
            });

            if(cars)  return cars;

            throw new Error(`Error getting cars in location '${locationName}'`);
        }

        throw new Error(`Location '${locationName}' not found`);

    } catch (error: any) {
        console.log(error);
        return[];
    }
}

export const updateCarsService = async(car: CarEntity) =>{
    return db
    .update(CarTable)
        .set(car)
        .where(eq(CarTable.carID, car.carID))
        .returning();
}