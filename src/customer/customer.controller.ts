import {Request, Response} from "express"
import { createCustomerService, getCustomerByEmailService, getCustomerByIdService } from "./customer.service";

// Create customer
export const createCustomerController = async (req: Request, res: Response) => {
  try {
    const customerData = req.body;
    const customer = await createCustomerService(customerData);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
};

// Get customer by email
export const getCustomerByEmailController = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const customer = await getCustomerByEmailService(email);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving customer', error });
  }
};

// Get customer by ID
export const getCustomerByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.customerId);
    const customer = await getCustomerByIdService(id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving customer', error });
  }
};