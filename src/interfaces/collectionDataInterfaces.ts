import { CollectionFieldType, CollectionValidations } from "./collectionInterfaces";

export default interface CollectionData {
	/** The name of the collection being created */
	name: string;
	/** The unique slug of the collection */
	slug: string;
	pluralName: string;
	singularName: string;
	/**
	 * An array of collection fields. Each collection field must have a `name` and `type`.
	 *
	 * Example:
	 *
	 *      fields: [
	 *        {
	 *          type: "Color",
	 *          name: "Color"
	 *        },
	 *        {
	 *          name: "Business Name",
	 *          type: "PlainText",
	 *          primaryName: true,
	 *        },
	 *        {
	 *          type: "Bool",
	 *          name: "Featured?",
	 *          helpText: "Should this business be featured?"
	 *        },
	 *        {
	 *          name: "Rating",
	 *          type: "Number",
	 *          required: true,
	 *          validations: {
	 *             allowNegative: false,
	 *             format: "integer",
	 *             maximum: 5
	 *          }
	 *        }
	 *      ]
	 */
	fields: CollectionDataFields[];
}

export interface CollectionDataFields {
	/** A temporary ID given to the field before it is created */
	tempId: string;
	/** The name of the collection field */
	name: string;
	/** The type of collection field  */
	type: CollectionFieldType;
	/**
	 * Set to true if this field will be a required field
	 * @default false
	 */
	required?: boolean;
	/** Validations an item field must adhere to */
	validations?: CollectionValidations<any>;
	/** Human readable text that describes the collection field */
	helpText?: string;
	/**
	 * Set to true if this field will be the primary name field. There can only be
	 * one primary name collection field
	 * @default false
	 */
	primaryName?: boolean;
	/**
	 * Set to true if this field will be the primary slug field. There can only be
	 * one primary slug collection field
	 * @default false
	 */
	primarySlug?: boolean;
}
