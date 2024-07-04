import { useComingSoon } from "../contexts/ComingSoonContext";
import Popup from "./utilities/PopUp";
import { ButtonPrimary } from "./utilities/PrimaryButton";

export const ComingSoon = () => {
	const { comingSoon, setComingSoon } = useComingSoon();
	return (
		<Popup
			imageUrl="https://storage.googleapis.com/ofaiv2/companions/kiya/dress.jpg"
			show={comingSoon}
			close={() => setComingSoon(false)}>
			<div className="p-4">
				<h1 className="text-xl font-semibold text-center mb-4">
					This feature is coming soon!
				</h1>
				<ButtonPrimary onClick={() => setComingSoon(false)}>
					Continue
				</ButtonPrimary>
			</div>
		</Popup>
	);
};
