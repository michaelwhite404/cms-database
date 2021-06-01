import AppContainer from "../../components/AppContainer/AppContainer";
import Heading from "../../components/AppContainer/Heading";
import HeadingButtons from "./HeadingButtons";

export default function Project() {
	return (
		<AppContainer>
			<Heading title="Project">
				<HeadingButtons />
			</Heading>
		</AppContainer>
	);
}