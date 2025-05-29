import { eq } from "drizzle-orm";
import db from "../../Drizzle/db";
import { MaintenanceEntity, MaintenanceTable } from "../../Drizzle/schema";
import maintenance from "./maintainance.router";

export const createMaintenanceService = async (maintenance: MaintenanceEntity) => {
    return db.insert(MaintenanceTable)
    .values(maintenance)
    .returning()
}

// Get maintenance by maintenanceId
export const getMaintenanceByIdService = async (maintenanceId: number) => {
    try {
        const maintenance = await db.query.MaintenanceTable.findFirst({
            where: eq(MaintenanceTable.maintenanceID, maintenanceId),
        });
        return maintenance || null;
    } catch (error: any) {
        throw new Error(`Get maintenance by ID error: ${error.message}`);
    }
};

// Get maintenance records by carId
export const getMaintenanceByCarIdService = async (carId: number) => {
    try {
        const maintenances = await db.query.MaintenanceTable.findMany({
            where: eq(MaintenanceTable.carID, carId),
        });
        return maintenances || [];
    } catch (error: any) {
        throw new Error(`Get maintenance by car ID error: ${error.message}`);
    }
};
