import { Router } from "express";
import * as fieldController from "../controllers/fieldController";

/** Router for field routes */
const router = Router({ mergeParams: true });

router
	.route("/")
	.get(fieldController.getAllCollectionFields)
	.post(fieldController.createCollectionField);

router
	.route("/:field_id")
	.get(fieldController.getCollectionField)
	.patch(fieldController.updateCollectionField)
	.delete(fieldController.deleteCollectionField);

export default router;
