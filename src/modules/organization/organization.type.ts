import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export interface IOrganizationDoc extends IDoc {
  name: string;
  hotline: string;
  email: string;
  webUrl: string;
  thumbnail: string;
  banner: string;
  address: string;
}
