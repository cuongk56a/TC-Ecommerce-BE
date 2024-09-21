import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';


export enum BANNER_ACTION_TYPE {
  NAV_BLOG = 'NAV_BLOG',
  NAV_PRODUCT = 'NAV_PRODUCT',
  NAV_DEFAULT = 'NAV_DEFAULT'
}

export interface IBannerDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  name: string;
  thumbnail: string;
  entityType: BANNER_ACTION_TYPE;
  entityId: string;
  isActive?: boolean;
}
