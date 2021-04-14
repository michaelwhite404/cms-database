import { CollectionField } from "./interfaces/collectionInterfaces";

export const defaultCollectonFields: CollectionField[] = [
  {
    editable: false,
    required: true,
    type: "Date",
    slug: "created-on",
    name: "Created On",
  },
  {
    editable: false,
    required: true,
    type: "Date",
    slug: "updated-on",
    name: "Updated On",
  },
  {
    editable: false,
    required: true,
    type: "User",
    slug: "created-by",
    name: "Created By",
  },
  {
    editable: false,
    required: true,
    type: "User",
    slug: "updated-by",
    name: "Updated By",
  },
];

/** Default Primary Name Object */
export const defaultPrimaryName: CollectionField = {
  editable: true,
  required: true,
  type: "PlainText",
  slug: "name",
  name: "Name",
};

/** Default Primary Slug Object */
export const defaultSlugName: CollectionField = {
  validations: {
    singleLine: true,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
  editable: true,
  required: true,
  type: "PlainText",
  slug: "name",
  name: "Name",
};
