import { createContext, ReactNode, useState } from "react";

interface ISuccessNotificationC {
	successMessage: [string, string?];
	successNotificationOpen: boolean;
	setSuccessNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
	animateSuccessNotification: (mainMessage: string, secondaryMessage?: string) => void;
}

const SuccessNotificationContext = createContext<ISuccessNotificationC>(
	{} as ISuccessNotificationC
);

export const SuccessNotificationProvider = ({ children }: { children: ReactNode }) => {
	const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState<[string, string?]>([""]);
	const animateSuccessNotification = (mainMessage: string, secondaryMessage?: string) => {
		setSuccessMessage([mainMessage, secondaryMessage]);
		setSuccessNotificationOpen(true);
		setTimeout(() => {
			setSuccessNotificationOpen(false);
			setSuccessMessage([""]);
		}, 3500);
	};

	return (
		<SuccessNotificationContext.Provider
			value={{
				successMessage,
				successNotificationOpen,
				animateSuccessNotification,
				setSuccessNotificationOpen,
			}}
		>
			{children}
		</SuccessNotificationContext.Provider>
	);
};

export default SuccessNotificationContext;
