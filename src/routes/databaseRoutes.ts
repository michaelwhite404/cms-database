import { Router } from "express";
import * as databaseController from "../controllers/databaseController";
import collectionRouter from "./collectionRoutes";

/** Router for database routes*/ 
const router = Router();

router.use("/:database_id/collections", collectionRouter)

router.route("/")
  .get(databaseController.getAllDatabases)
  .post(databaseController.createDatabase);

router.route("/:database_id")
  .get(databaseController.getDatabase)
  .delete(databaseController.deleteDatabase);

export default router;