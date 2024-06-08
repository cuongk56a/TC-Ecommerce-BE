import { Request, Response, NextFunction } from 'express';
import { roleService } from "../modules/role/role.service";
import httpStatus from 'http-status';
import { UserModel } from '../modules/user/user.model';

export const checkPermission = (permission:string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { roleCheckId } = req.body;
        try {
            const [role, user] = await Promise.all([
                roleService.getOne({_id: roleCheckId}),
                UserModel.findOne({_id: req.userId})
            ]) 
            if ((!!role && role.permissions.includes(permission)) || user?.isAdmin === true) {
                next();
            } else {
                return res.status(httpStatus.UNAUTHORIZED).send('Not Have Authorized!');
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    };
}