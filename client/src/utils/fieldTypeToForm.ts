import FormProps from "../interfaces/FormProps";
import BasicForm from "../Pages/Project/Forms/BasicForm";
import PlainTextForm from "../Pages/Project/Forms/PlainTextForm";

interface TypeData {
	PlainText: (props: FormProps) => JSX.Element;
	// RichText:
	ImageRef: (props: FormProps) => JSX.Element;
	Video: (props: FormProps) => JSX.Element;
	Link: (props: FormProps) => JSX.Element;
	Email: (props: FormProps) => JSX.Element;
	Phone: (props: FormProps) => JSX.Element;
	// Number:
	// Date:
	// Bool:
	Color: (props: FormProps) => JSX.Element;
	// Option:
	File: (props: FormProps) => JSX.Element;
	// ItemRef:
	// ItemRefMulti:
}

const forms: TypeData = {
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
