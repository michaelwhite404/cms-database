import slugify from "slugify";
import {
  CollectionField,
  CollectionValidations,
} from "./interfaces/collectionInterfaces";
/**
 * Creates a new collection field
 */
export class CustomCollectionField implements CollectionField {
  name: string;
  type: string;
  editable: boolean;
  required: boolean;
  slug: string;
  validations: CollectionValidations | undefined;
  helpText: string | undefined;

  /**
   *
   * @param name The name of the collection field
   * @param type The type of collection field
   * @param required Unique slug identifier for the field
   * @param validations Validations an item field must adhere to
   * @param helpText Human readable text that describes the field
   */
  constructor(
    name: string,
    type: string,
    required: boolean = false,
    validations?: CollectionValidations,
    helpText?: string
  ) {
    this.name = name;
    this.type = type;
    this.slug = slugify(name, { lower: true });
    this.editable = true;
    this.required = required;
    this.validations = validations;
    this.helpText = helpText;
  }
}
