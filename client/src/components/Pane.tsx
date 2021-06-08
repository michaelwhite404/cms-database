export default function Pane({ children }: { children: React.ReactNode }) {
	return <div className="px-4 sm:px-6 pb-6">{children}</div>;
}

Pane.Title = ({ children }: { children: string }) => (
	<h3 className="text-2xl font-semibold mt-2.5">{children}</h3>
);

Pane.Item = ({ children }: { children: React.ReactNode }) => <div className="pt-6">{children}</div>;
