import { Router } from "express";
import * as fieldController from "../controllers/fieldController";
import * as authController from "../controllers/authController";

/** Router for field routes */
const router = Router({ mergeParams: true });

router
	.route("/")
	.get(fieldController.getAllCollectionFields)
	.post(authController.restrictTo("owner", "editor"), fieldController.createCollectionField);

router
	.route("/:field_id")
	.get(fieldController.getCollectionField)
	.patch(authController.restrictTo("owner", "editor"), fieldController.updateCollectionField)
	.delete(authController.restrictTo("owner", "editor"), fieldController.deleteCollectionField);

export default router;
