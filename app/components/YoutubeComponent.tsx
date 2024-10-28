"use client";
import React from "react";
import { useCookies } from "../context/CookiesContext";

import Image from "next/image";
import LinkCookies from "./CookiesLink";

// exemple youtube component

const YoutubeComponent: React.FC = () => {
	const { isServiceEnabled } = useCookies();

	return (
		<>
			{!isServiceEnabled(3) ? (
				<div className="flex justify-center items-center w-[560px] h-[315px] relative">
					<Image
						alt="youtube"
						fill
						objectFit="cover"
						className="opacity-90 "
						src="https://img.youtube.com/vi/gfU1iZnjRZM/0.jpg"
					/>
					<LinkCookies
						text="Autorisation necessaire"
						className="absolute z-2 text-white bg-black px-3 py-1 rounded-full"
					/>
				</div>
			) : (
				<iframe
					width="560"
					height="315"
					src="https://www.youtube-nocookie.com/embed/gfU1iZnjRZM?si=rcErTfPeKrdWm8YY"
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
				></iframe>
			)}
		</>
	);
};

export default YoutubeComponent;
