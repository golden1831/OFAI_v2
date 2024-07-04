import Footer from "../../components/Footer";
import { ButtonPrimary } from "../../components/utilities/PrimaryButton";
import { useWeb3Auth } from "../../providers/Wallet";
import { useSelector } from "react-redux";
import leftArrowIcon from "../../assets/arrows/left.svg";
import SignInPopup from "./SignInPopup";
import { RootState } from "../../Navigation/redux/store/store";
import { profileAvatar } from "../../lib/getProfileAvatar";
import { Link, useNavigate } from "react-router-dom";
import { chevronLeftIcon } from "../../assets/icons";
import { IUpdateUserRequest, useUpdateUserMutation } from "../../Navigation/redux/apis/userApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { z } from "zod";
import { Option, MultiSelect } from "../../components/MultiSelect";
import { formattedTraits } from "../../lib/traits";
import Popup from "../../components/utilities/PopUp";
import CropAvatar from "./CropAvatar";

type FormFields = Omit<IUpdateUserRequest, "headers" | "interests"> & { 
	interests: Option[] 
}

const UserProfile = () => {
	const [form, setForm] = useState<FormFields>({
		name: "",
		email: "",
		username: "",
		interests: [],
	});
	const [cropImage, setCropImage] = useState<string | null>(null);

	const navigate = useNavigate()

	const { headers, disconnect } = useWeb3Auth();

	const user = useSelector((state: RootState) => state.user.user);
	const authStatus = useSelector((state: RootState) => state.auth.authStatus);

	const [updateUser, { isLoading }] = useUpdateUserMutation();

	const slug = user.username ?? user.walletAddress;

	useEffect(() => {
		if (user) {
			const interests: string[] = user.interests ? JSON.parse(user.interests) : [];

			const listOfInterests = interests.map((item) => formattedTraits.find((trait) => trait.value === item) as Option)

			setForm((prev) => ({
				...prev,
				name: user.name ?? "",
				email: user.email ?? "",
				username: user.username ?? "",
				interests: listOfInterests,
			}));
		}
	}, [user]);

	if (!user || !authStatus) return <SignInPopup />

	async function onUpdateUser() {
		if (form.image) {
			const image = new Image();

			image.src = URL.createObjectURL(form.image);

			await image.decode();

			if (image.width < 400 || image.height < 400) {
				toast.error("The image must be up to 400x400px");

				return;
			}
		}

		const schema = z.object({
			email: z.string().email(),
		})

		const response = schema.safeParse(form);

		if (!response.success) {
			const parsedMessage = JSON.parse(response.error.message) as Array<{ message: string }>;
			
			const zodError = parsedMessage[0];

			toast.error(zodError.message);

			return;
		}

		function transformUsername(username: string) {
			const searchable = username
				.toLowerCase()
				.trim()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/\//g, '-')
				.replace(/,/g, '');

			return searchable
			.replace(/\s+/g, '-')
		}

		await updateUser({
			name: form.name,
			email: form.email,
			image: form.image,
			headers,
			username: form.username ? transformUsername(form.username) : "",
			interests: form.interests.map((i) => i.value),
		})
			.unwrap()
			.then(() => {
				toast.success("Profile updated successfully", { theme: "dark" });
				
				navigate("/my-profile");
			})
			.catch((err) => {
				const error = err as FetchBaseQueryError & {
					data: {
						message: string
					}
				}

				toast.error(error.data?.message ?? "Something went wrong")
			});
	}

	async function handleDisconnect() {
		await disconnect();
		
		window.location.reload();
	}

	function onFillCrop(file?: File) {
		if (!file) return;

		setCropImage(URL.createObjectURL(file));
	}

	const profileImage = form.image ? URL.createObjectURL(form.image) : profileAvatar(user.profileImage);

	return (
		<div className="flex flex-col max-w-4xl mx-auto my-10 justify-center w-full gap-8 px-6 md:flex-row">
			<div className="flex flex-col w-full gap-6 flex-grow">
				<div className="flex flex-col">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
							<Link to="/my-profile">
								<img src={chevronLeftIcon} />
							</Link>

							About
						</h1>

						<ButtonPrimary 
							onClick={onUpdateUser}
							disabled={isLoading}
							className="text-sm w-fit px-6 pt-2 pb-3 font-medium" 
						>
							{isLoading ? "Updating..." : "Save"}
						</ButtonPrimary>
					</div>

					<div className="flex items-center gap-8 mb-6">
						<div className="size-28 min-w-28 relative rounded-full border-2 border-solid border-white/50">
							<img 
								src={profileImage} 
								alt="" 
								className="size-full aspect-square object-cover rounded-full" 
							/>
						</div>

						<div className="flex flex-col gap-4">
							<button 
								type="button" 
								className="relative py-2 px-3 rounded-xl bg-white/10 transition-all duration-300 hover:bg-white/20 md:px-6"
							>
								<input 
									type="file" 
									accept="image/*" 
									onChange={(e) => onFillCrop(e.target.files?.[0])}
									className="opacity-0 absolute size-full inset-0" 
								/>
								<label className="text-sm text-white font-medium">Upload New Photo</label>
							</button>

							<p className="text-white">
								At least  400 x 400 px. <br />
								JPG or PNG is allowed.
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-sm text-white/60">E-mail</label>
							<input
								value={form.email}
								onChange={(e) => setForm({ ...form, email: e.target.value })}
								disabled={user.type === "social"}
								className="bg-white/10 rounded-xl py-3.5 px-5 text-white placeholder:text-white/50"
							/>
						</div>
						
						<div className="flex flex-col gap-1">
							<label className="text-sm text-white/60">Nickname</label>
							<input
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								className="bg-white/10 rounded-xl py-3.5 px-5 text-white placeholder:text-white/50"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm text-white/60">Name</label>
							<input
								value={form.username}
								onChange={(e) => setForm({ ...form, username: e.target.value })}
								className="bg-white/10 rounded-xl py-3.5 px-5 text-white placeholder:text-white/50"
								placeholder="Add your username"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm text-white/60">Interests</label>
							<MultiSelect
								data={formattedTraits}
								selected={form.interests}
								onSelected={(values) => setForm({ ...form, interests: values.length > 3 ? form.interests : values})}
							/>
						</div>
						
						<div className="flex flex-col gap-1">
							<label className="text-sm text-white/60">Wallet</label>
							<input
								value={user.walletAddress}
								disabled
								className="bg-white/10 rounded-xl py-3.5 px-5 text-white placeholder:text-white/50"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm text-white/60">Referral Link</label>
							<input
								value={`ofai.app/referral/${slug}`}
								disabled
								className="bg-white/10 rounded-xl py-3.5 px-5 text-white placeholder:text-white/50"
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col">
					<h2 className="text-xl font-semibold mb-4 text-white">Other</h2>

					<Link to="https://ofai.ai" target="_blank" className="flex justify-between items-center rounded-t-2xl text-white bg-white/5 w-full py-4 px-5 border-b border-solid border-b-white/5">
						Terms & Conditions
						<img
							src={leftArrowIcon}
							className="rotate-180 size-3 opacity-50"
						/>
					</Link>
					<Link to="https://ofai.ai" target="_blank" className="flex justify-between items-center text-white bg-white/5 w-full py-4 px-5 border-b border-solid border-b-white/5">
						Privacy Policy
						<img
							src={leftArrowIcon}
							className="rotate-180 size-3 opacity-50"
						/>
					</Link>
					<Link to="https://ofai.ai" target="_blank" className="flex justify-between items-center text-white bg-white/5 w-full py-4 px-5 border-b border-solid border-b-white/5">
						FAQ
						<img
							src={leftArrowIcon}
							className="rotate-180 size-3 opacity-50"
						/>
					</Link>
					<a 
						rel="noreferrer" 
						href="mailto:support@ofai.ai" 
						target="_blank"
						className="flex justify-between items-center text-white bg-white/5 w-full py-4 px-5 border-b border-solid border-b-white/5"
					>
						Help & Support
						<img
							src={leftArrowIcon}
							className="rotate-180 size-3 opacity-50"
						/>
					</a>
					<button
						onClick={handleDisconnect}
						className="flex justify-between items-center rounded-b-2xl text-white bg-white/5 w-full py-4 px-5"
					>
						Logout
						<img
							src={leftArrowIcon}
							className="rotate-180 size-3 opacity-50"
						/>
					</button>
				</div>
			</div>

			<div className="flex flex-col mb-16 gap-5 w-full md:mb-0 md:max-w-xs">
				<div className="flex flex-col bg-white/5 p-6 w-full rounded-2xl">
					<div className="flex items-center justify-between text-xl font-medium">
						<h2 className="text-white">Current Plan</h2>

						<p className="text-white/60">Free</p>
					</div>

					<p className="text-white/60 mt-5 mb-6 text-sm font-medium">
						Check our subscription plans and find the best one for your needs.
					</p>

					<Link to="/wallet">
						<ButtonPrimary className="text-sm py-2 font-medium">Subscribe</ButtonPrimary>
					</Link>
				</div>
				
				{/* <div className="flex flex-col bg-white/5 p-6 w-full rounded-2xl">
					<h2 className="text-white text-xl font-medium">Automatic Notifications</h2>

					<div className="flex gap-2 mt-5 mb-6">
						<input
							type="checkbox"
							className="relative top-0.5 size-5"
						/>

						<p className="text-white/60 text-sm font-medium">
							As a user, your will receive automatic notifications from us. If
							you don't want any notifications, uncheck the box by clicking on
							it.
						</p>
					</div>

					<ButtonPrimary className="text-sm py-2 font-medium">Subscribe</ButtonPrimary>
				</div> */}
			</div>

			<Footer />

			<Popup
				show={!!cropImage}
				close={() => setCropImage(null)}
				className="[&>div]:p-0 [&>div]:size-full max-w-xl !w-full !h-fit mx-6"
			>
				<div className="flex flex-col h-96 relative w-full">
					{cropImage && (
						<CropAvatar 
							initialImage={cropImage} 
							onCroppedImage={(file) => setForm((prev) => ({ ...prev, image: file }))} 
						/>
					)}
				</div>

				<ButtonPrimary onClick={() => setCropImage(null)} className="mt-4">
					Close
				</ButtonPrimary>
			</Popup>
		</div>
	);
};

export default UserProfile;
