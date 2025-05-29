import db from "../Drizzle/db";
import { LocationEntity, LocationTable } from "../Drizzle/schema";

// Get all locations
export const getAllLocationsService = async () => {
    try{
        const locations = await db.query.LocationTable.findMany();

        if(locations) return locations;
    
        throw new Error("There was a db error in fetching locations.")
    }catch(error: any){
        console.log()
    }
};

export const createLocationService = async (location: LocationEntity) => {
    try{
        const createdLocation = await db.insert(LocationTable)
                .values(location)
                .returning()

        if(createdLocation) return createdLocation;

        throw new Error("There was an error in creating a location.")
    }catch(error: any){
        console.log(error)
        return [];
    }
}