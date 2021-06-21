const reservedFieldNames = [
	"name",
	"slug",
	"created-by",
	"updated-by",
	"updated-on",
	"created-on",
	"id",
] as const;

export default reservedFieldNames;

export type ReservedFieldName = typeof reservedFieldNames[number];
