import BasicForm from "../Pages/Project/Forms/BasicForm";
import PlainTextForm from "../Pages/Project/Forms/PlainTextForm";

const forms = {
	PlainText: PlainTextForm,
	// RichText: RichTextForm,
	ImageRef: BasicForm,
	Video: BasicForm,
	Link: BasicForm,
	Email: BasicForm,
	Phone: BasicForm,
	// Number: NumberForm,
	// Date: DateForm,
	// Bool: BasicForm (Not exactly),
	Color: BasicForm,
	// Option: OptionForm,
	File: BasicForm,
	// ItemRef: ReferenceForm,
	// ItemRefMulti: ReferenceForm
};

export default forms;
