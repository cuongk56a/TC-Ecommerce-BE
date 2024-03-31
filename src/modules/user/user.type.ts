import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface IUserDoc extends IDoc {
  CODE: string;

  // userName: string;
  phone: string;
  email: string;
  fullName: string;
  hashedPassword: string;
  avatar: string;
  birthday: string;
  gender: UserGender;
  country: string;
  address: string;
  importCode: string;
  organizationId: mongoose.Schema.Types.ObjectId;
  isAdmin: boolean;
  isTeacher: boolean;
}
