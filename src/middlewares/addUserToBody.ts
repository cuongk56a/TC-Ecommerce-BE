import {Request, Response} from 'express';
import {RequestParams} from '../types/enumTypes';

export const addDataToBody = (body: {[x: string]: RequestParams}) => (req: Request, res: Response, next: any) => {
  Object.keys(body).forEach(key => {
    req.body[key] = req[body[key]];
    if (key == 'deletedById') {
      req.body.deletedAt = new Date();
    }
  });
  next();
};

export const addParamToBody = (paramsKeys: string[]) => (req: Request, res: Response, next: any) => {
  paramsKeys.forEach(key => {
    req.body[key] = req.params[key];
  });
  next();
};

export function addCreatedByIdToBody(req: Request, res: Response, next: any) {
  // console.log("req.userId", req.userId)
  // console.log("req.userInfo", req.userInfo)
  req.body.createdById = req.userId;
  // req.body.createdAt = new Date();
  next();
}

export function addUpdatedByIdToBody(req: Request, res: Response, next: any) {
  // console.log("req.userId", req.userId)
  // console.log("req.userInfo", req.userInfo)
  req.body.updatedById = req.userId;
  // req.body.createdAt = new Date();
  next();
}

export function addDeletedByToBody(req: Request, res: Response, next: any) {
  req.body.deletedById = req.userId;
  req.body.deletedAt = new Date();
  return next();
}
