import {QueryOptions} from 'mongoose';
import {CategoryModel} from './category.model';
import {ICategoryDoc} from './category.type';

const createOne = async (body: any): Promise<ICategoryDoc | null> => {
  return CategoryModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<ICategoryDoc | null> => {
  return CategoryModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

// const deleteOne = async (filter: any): Promise<ICategoryDoc | null> => {
//   return CategoryModel.findOneAndDelete(filter);
// };

const getOne = async (filter: any, options?: QueryOptions): Promise<ICategoryDoc | null> => {
  return CategoryModel.findOne(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    options,
  );
};

const getList = async (filter: any, options?: QueryOptions, sortOptions?:any): Promise<ICategoryDoc[]> => {
  return CategoryModel.paginate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    {sort: {...sortOptions,createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: QueryOptions, sortOptions?:any): Promise<ICategoryDoc[]> => {
  return CategoryModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {...sortOptions,createdAt: -1}, ...options},
  );
};

const getChildIds = async (parentIds: string[]): Promise<string[]> => {
  const catDatas = await getAll({_id: {$in: parentIds}}, {hasChild: true});
  let catIds: string[] = [];
  const pushCatId = (cArr: ICategoryDoc[]) => {
    cArr.forEach(c => {
      catIds.push(c.id);
      pushCatId(c.child);
    });
  };
  pushCatId(catDatas);
  return catIds;
};

export const categoryService = {
  createOne,
  updateOne,
  // deleteOne,
  getOne,
  getList,
  getAll,
  getChildIds,
};
