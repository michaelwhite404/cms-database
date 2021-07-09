export default function Pane({ children }: { children: React.ReactNode }) {
	return <div className="relative px-4 sm:px-6 pb-6">{children}</div>;
}

Pane.Title = ({ children }: { children: string }) => (
	<h3 className="text-2xl font-semibold mt-2.5">{children}</h3>
);

Pane.MiniTitle = ({ children }: { children: string }) => (
	<h3 className="text-md font-semibold mt-2.5 my-3">{children}</h3>
);

Pane.Item = ({ children }: { children: React.ReactNode }) => <div className="pt-6">{children}</div>;
