import { PropsWithChildren, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";

export const SectionWithNavbar = ({	children }: PropsWithChildren) => {
	const { pathname } = useLocation()

	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		window.addEventListener("resize", () => setWidth(window.innerWidth))

		return () => window.removeEventListener("resize", () => {
			setWidth(window.innerWidth);
		})
	}, [])

	const isLarge = width > 1024;
	const isMedium = width >= 768;
	const isMobile = width < 768;

	let usesNavbar = false

	if (isMobile) {
		if (pathname !== "/explore") {
			usesNavbar = true;
		}
		if (/^\/chat\/[a-zA-Z0-9-_]+\/?$/.test(pathname)) {
			usesNavbar = false;
		}
		if (/^\/model\/[a-zA-Z0-9-_]+\/?$/.test(pathname)) {
			usesNavbar = false;
		}
	}

	if (isMedium) {
		usesNavbar = true
	}
	
	return (
		<>
			{usesNavbar && <Navbar isLarge={isLarge}/>}
			
			<section className={`${usesNavbar && 'lg:ml-[280px] mt-16 h-[calc(100vh-144px)] overflow-scroll overflow-x-clip md:h-[calc(100vh-64px)]'}`}>
				{children}
			</section> 
		</>
	);
};
