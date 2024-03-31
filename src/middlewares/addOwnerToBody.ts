import {Request, Response} from 'express';
export const addOwnerToBody = () => (req: Request, res: Response, next: any) => {
  req.body.createdById = req.userId;
  
  next();
};
