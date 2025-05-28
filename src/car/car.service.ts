import db from "../Drizzle/db"
import {}

//Create a car 
export const createCar = async (carData: any) => {
    try {
        const [insertedCar] = await db.insert(carData).returning('*');
    } catch (error: any) {
        throw new Error(`Failed to create car: ${error.message}`);
    }
}