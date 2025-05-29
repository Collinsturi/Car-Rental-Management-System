import { eq, ilike } from "drizzle-orm";
import db from "../Drizzle/db";
import { InsuranceTable, InsuranceEntity } from "../Drizzle/schema";

// Create insurance
export const createInsuranceService = async (insuranceData: InsuranceEntity) => {
    try {
        const [createdInsurance] = await db.insert(InsuranceTable).values(insuranceData).returning();
        if (createdInsurance) return createdInsurance;

        throw new Error("Failed to create insurance.");
    } catch (error: any) {
        throw new Error(`Create insurance error: ${error.message}`);
    }
}

// Get insurance by ID
export const getInsuranceByIdService = async (insuranceId: number) => {
    try {
        const insurance = await db.query.InsuranceTable.findFirst({
            where: eq(InsuranceTable.insuranceID, insuranceId),
        });
        return insurance || null;
    } catch (error: any) {
        throw new Error(`Get insurance by ID error: ${error.message}`);
    }
}

// Get insurances by car ID
export const getInsurancesByCarIdService = async (carId: number) => {
    try {
        const insurances = await db.query.InsuranceTable.findMany({
            where: eq(InsuranceTable.carID, carId),
        });
        return insurances || [];
    } catch (error: any) {
        throw new Error(`Get insurances by car ID error: ${error.message}`);
    }
}

// Get insurances by provider (case-insensitive match)
export const getInsurancesByProviderService = async (provider: string) => {
    try {
        const insurances = await db.query.InsuranceTable.findMany({
            where: ilike(InsuranceTable.insuranceProvider, `%${provider}%`),
        });
        return insurances || [];
    } catch (error: any) {
        throw new Error(`Get insurances by provider error: ${error.message}`);
    }
}

// Get all insurances
export const getAllInsurancesService = async () => {
    try {
        const insurances = await db.query.InsuranceTable.findMany();
        return insurances || [];
    } catch (error: any) {
        throw new Error(`Get all insurances error: ${error.message}`);
    }
}
