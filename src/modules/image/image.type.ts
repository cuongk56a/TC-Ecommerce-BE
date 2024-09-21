import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export interface IImageDoc extends IDoc {
  originalName: string;
  fileName: string;
  path: string;
  size: number;
  mimetype: string;
  fileExtension: string;
  fileType: string;
}
export interface MulterFile {
  originalname: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}