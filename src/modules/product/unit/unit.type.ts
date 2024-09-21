import mongoose from 'mongoose';
import {IDoc} from '../../../utils/types/entityTypes';

export interface IUnitDoc extends IDoc {
  name: string;
  description: string;
  isActive: boolean;
}
