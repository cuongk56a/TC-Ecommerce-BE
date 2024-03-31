import { Request, Response } from 'express';

export const convertSearchFilter = (keySearch: string) => (req: Request, res: Response, next: any) => {
  const { search } = req.query;
  req.query.searchJson = !!search
    ? JSON.stringify({
      [keySearch]: { $regex: search }
    })
    : "{}";
  delete (req.query.search)
  next()
}
