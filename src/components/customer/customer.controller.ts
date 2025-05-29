import {Request, Response} from "express"
import { createCustomerService, deleteCustomerService, getCustomerByEmailService, getCustomerByIdService, updateCustomerService } from "./customer.service";

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

export const updateCustomerController = async (req: Request, res: Response) => {
  try{
    const updatedCustomer = await updateCustomerService(req.body)

    if(updatedCustomer){
      res.status(200)
      .json({
        message: "Updated successfully.",
        data: updatedCustomer
      })

      return;
    }

    res.status(500)
    .json({
      message: "There was an error in updating the database entry."
    })
  }catch(error: any){
     res.status(500)
    .json({
      message: "There was an error in updating the database entry."
    })
  }
}


export const deleteCustomerController = async (req: Request, res: Response) =>{
  try{
    const customer = await deleteCustomerService(req.body);

    if(customer){
      res.status(200)
      .json({
        message: "Customer deleted successfully."
      })
    }

       res.status(500)
          .json({
            message: "Customer deleted successfully."
          })
  }catch(error: any){
    res.status(500)
    .json({
      message: "Customer deleted successfully."
    })
  }
}