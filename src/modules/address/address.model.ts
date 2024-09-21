import mongoose from 'mongoose';
import {IAddressDoc} from './address.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_ADDRESS} from './address.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';
import { TABLE_LOCATION } from '../location/location.configs';

export interface IAddressModelDoc extends IAddressDoc {}
interface IAddressModel extends IDocModel<IAddressModelDoc> {}

const addressSchema = new mongoose.Schema<IAddressModelDoc>(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    provinceId: {
      type:mongoose.Schema.Types.ObjectId,
      required: true
    },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    wardId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    note: {
      type: String,
      required: true
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedAt: {type: Date, required: false},
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

addressSchema.plugin(toJSON);
addressSchema.plugin(paginate);

addressSchema.virtual('province', {
  ref: TABLE_LOCATION,
  localField: 'provinceId', 
  foreignField: '_id', 
  justOne: true,
});

addressSchema.virtual('district', {
  ref: TABLE_LOCATION,
  localField: 'districtId', 
  foreignField: '_id', 
  justOne: true,
});

addressSchema.virtual('ward', {
  ref: TABLE_LOCATION,
  localField: 'wardId', 
  foreignField: '_id', 
  justOne: true,
});

const populateArr = ({hasLocation}: {hasLocation: boolean}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasLocation
        ? [
            {
              path: 'province',
            },
            {
              path: 'district',
            },
            {
              path: 'ward'
            }
          ]
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

addressSchema.pre('findOne', preFind);
addressSchema.pre('find', preFind);


/**
 * @typedef Address
 */
export const AddressModel = mongoose.model<IAddressModelDoc, IAddressModel>(TABLE_ADDRESS, addressSchema);
