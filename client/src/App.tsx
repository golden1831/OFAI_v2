import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter } from "react-router-dom";
import ReduxProvider from "./Navigation/redux/provider";
import Navigation from "./Navigation/Navigation";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./Navigation/redux/store/store";
import { WalletProvider } from "./providers/Wallet";
import { ComingSoonProvider } from "./contexts/ComingSoonContext";
import { SectionWithNavbar } from "./components/Navbar/SectionWithNavbar";
import { ToastContainer } from "react-toastify";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import SocialBanner from "./assets/images/social-banner.png"

function App() {
	const persistor = persistStore(store);

	return (
		<HelmetProvider>
			<PersistGate persistor={persistor}>
				<ReduxProvider>
					<BrowserRouter>
						<WalletProvider>
							<ComingSoonProvider>
								<SectionWithNavbar>
									<Helmet>
										<meta property="og:image" content={SocialBanner} />
										<meta property="og:description" content="The Future of Virtual Companions Chat with life-like Virtual Girls customized just for you! Start Chatting The Ultimate Girlfriend Experience OFAI’s AI models deliver intimate, tailored interactions that make you…" />
									</Helmet>

									<Navigation />

									<ToastContainer theme="dark" />
								</SectionWithNavbar>
							</ComingSoonProvider>
						</WalletProvider>
					</BrowserRouter>
				</ReduxProvider>
			</PersistGate>
		</HelmetProvider>
	);
}

export default App;
