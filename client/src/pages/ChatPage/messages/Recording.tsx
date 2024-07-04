import { useState, useEffect } from "react";

const Recording = ({ name }: { name: string }) => {
	const [ellipsis, setEllipsis] = useState("");

	useEffect(() => {
		const intervalId = setInterval(() => {
			setEllipsis((prev) => {
				if (prev == "   ") return ".  ";
				if (prev == ".  ") return ".. ";
				if (prev == ".. ") return "...";
				if (prev == "...") return "   ";
				else return "...";
			});
		}, 500);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="h-[30px] rounded-3xl flex items-center backdrop-blur-sm bg-[#56265066] p-2 ml-5 whitespace-pre-wrap">
			{name} is recording<span className="font-mono tracking-[-0.1rem] text-sm">{ellipsis}</span>
		</div>
	);
};

export default Recording;
