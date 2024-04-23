import { Request, Response, NextFunction } from 'express';
import { roleService } from "../modules/role/role.service";
import httpStatus from 'http-status';

export const checkPermission = (permission:string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { roleCheckId } = req.body;
        try {
            const role = await roleService.getOne({_id: roleCheckId});
            if (!!role && role.permissions.includes(permission)) {
                next();
            } else {
                return res.status(httpStatus.UNAUTHORIZED).send('Not Have Authorized!');
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    };
}