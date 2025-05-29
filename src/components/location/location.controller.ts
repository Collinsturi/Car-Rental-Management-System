import { Request, Response } from "express";
import { getAllLocationsService, createLocationService } from "./location.service";

// Controller to handle fetching all locations
export const getAllLocationsController = async (_req: Request, res: Response) => {
    try{
        const data = await getAllLocationsService();
        res.status(200).json({ message: "List of all locations", data });
    }catch(error: any){
        console.log(error);
        res.status(500)
        .json(
            {
                message: "There was an error in getting all the available locations."
            }
        )
    }
};

export const createLocationController = async (req: Request, res: Response) => {
    const data = await createLocationService(req.body)

    if(data) 
    {
        res.status(201)
        .json(
            {
                message: "Location created successfully.",
                payload: data
            }) 
        return;
    }

    res.status(500)
    .json({
        message: "There was an error with creating a location"
    })

}