import { useState } from "react";
import { FaAsterisk } from "react-icons/fa";
import { InputProps } from "../../interfaces/InputProps";
import Button from "../Icons/ButtonIcon";

interface FileProps extends InputProps {
	image?: boolean;
}

export default function FileInput({ id, title, required, image }: FileProps) {
	const [selected, setSelected] = useState(false);

	return (
		<div className="image-input">
			<label htmlFor={id} className="flex text-sm font-medium text-gray-900">
				{title}
				{required && <FaAsterisk color="red" className="w-1.5 ml-1.5 inline" />}
			</label>
			<div className="mt-2 mb-2.5 relative">
				<div className="w-full p-6 border border-gray-300 rounded-md flex flex-col items-center hover:bg-gray-50">
					{selected ? "" : <Unselected image={image || false} />}
				</div>
			</div>
		</div>
	);
}

const Unselected = ({ image }: { image: boolean }) => {
	return (
		<>
			{image ? <Button.Image /> : <Button.File />}
			<span className="font-bold text-base">Drag your {image ? "image" : "file"} here</span>
			<span className="text-xs">or click to browse a file</span>
		</>
	);
};
