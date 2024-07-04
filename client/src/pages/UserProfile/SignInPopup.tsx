import { useWeb3Auth } from "../../providers/Wallet";
import Popup from "../../components/utilities/PopUp";
import { ButtonPrimary } from "../../components/utilities/PrimaryButton";

export default function SignInPopup() {
	const { connect } = useWeb3Auth();

	return (
    <Popup
      show={true}
      imageUrl="https://storage.googleapis.com/ofaiv2/companions/melissa/lingerie.png"
    >
      <div className="p-4 flex flex-col justify-center items-center gap-4 max-w-md w-full">
        <h1 className="text-xl font-semibold text-center">
          You must be signed in to view your profile.
        </h1>
        
        <ButtonPrimary
          onClick={connect}
          className="font-semibold text-xl"
        >
          Sign in
        </ButtonPrimary>
      </div>
    </Popup>
  );
}