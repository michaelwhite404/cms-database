import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/customRequestInterface";
import DatabaseModel from "../interfaces/databaseInterface";
import Database from "../models/databaseModel";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

/**
 * Retrieves database based on database ID route parameter
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getDatabase = catchAsync(async (req: CustomRequest<DatabaseModel>, res: Response, next: NextFunction) => {
  /** Database returned */
  const database = await Database.findById(req.params.database_id).select("-__v");
  // If no database was found
  if (!database) {
    return next(new AppError("There is no database with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    database
  });
});

/**
 * Retrieves all databases
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 */
export const getAllDatabases = catchAsync(async (req: CustomRequest<DatabaseModel>, res: Response) => {
  const features = new APIFeatures<DatabaseModel>(Database.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const databases = await features.query;

  res.status(200).json({
    status: "success",
    /** The number of results that satisfy the query */
    results: databases.length,
    page: features.page,
    limit: features.limit,
    databases
  })
});

/**
 * Creates a new database
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 */
export const createDatabase = catchAsync(async (req: CustomRequest<DatabaseModel>, res: Response) => {
  /** Database created */
  const database = await Database.create({ name: req.body.name });

  res.status(201).json({
    status: "success",
    database
  });
});

/**
 * Retrieves database based on database ID route parameter
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const deleteDatabase = catchAsync(async (req: CustomRequest<DatabaseModel>, res: Response, next: NextFunction) => {
  /** The deleted database, if found */
  const database = await Database.findByIdAndDelete(req.params.database_id);
  // If no database is returned, throw error
  if (!database) {
    return next(new AppError("There is no database with this ID", 404));
  }
  // Send response
  res.status(200).json({
    status: "success",
    databasesDeleted: 1,
    // collectionsDeleted: number,
    // itemsDeleted: number
  });
});
