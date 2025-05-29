import db from "../Drizzle/db";
import { LocationEntity, LocationTable } from "../Drizzle/schema";

// Get all locations
export const getAllLocationsService = async () => {
    return await db.query.LocationTable.findMany();
};

export const createLocationService = async (location: LocationEntity) => {
    return await db.insert(LocationTable)
        .values(location)
        .returning()
}