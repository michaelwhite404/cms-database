export default function Badge({ role }: { role: string }) {
	return (
		<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ml-2 font-medium bg-pink-100 text-pink-800">
			{role}
		</span>
	);
}
