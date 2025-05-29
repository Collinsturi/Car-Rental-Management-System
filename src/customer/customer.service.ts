import db from '../Drizzle/db';
import { eq } from 'drizzle-orm';
import { CustomerTable } from '../Drizzle/schema';

// Create customer
export const createCustomerService = async (customerData: any) => {
  return await db.insert(CustomerTable).values(customerData).returning();
};

// Get customer by email
export const getCustomerByEmailService = async (email: string) => {
  return await db.query.CustomerTable.findFirst({
    where: eq(CustomerTable.email, email),
  });
};

// Get customer by ID
export const getCustomerByIdService = async (id: number) => {
  return await db.query.CustomerTable.findFirst({
    where: eq(CustomerTable.customerID, id),
  });
};
