import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export interface IImageDoc extends IDoc {
  fileName: string;
}
