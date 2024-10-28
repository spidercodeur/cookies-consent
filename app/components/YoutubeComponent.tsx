"use client";
import React from "react";
import { useCookies } from "../context/CookiesContext";

import Image from "next/image";

// exemple youtube component

const YoutubeComponent: React.FC = () => {
	const { isServiceEnabled, setServiceEnabled } = useCookies();

	const handleShowVideo = () => {
		setServiceEnabled(3, true);
	};

	return (
		<>
			{!isServiceEnabled(3) ? (
				<div className="flex justify-center items-center w-[560px] h-[315px] max-w-full relative">
					<Image
						alt="youtube"
						fill
						objectFit="cover"
						className="opacity-90 "
						src="https://img.youtube.com/vi/gfU1iZnjRZM/0.jpg"
					/>

					<div className="absolute m-auto bg-white/90 text-center p-2 rounded-lg">
						<button
							onClick={handleShowVideo}
							className=" z-2 text-white bg-red-600 px-3 py-1 rounded-full"
						>
							▶ Voir la vidéo
						</button>
						<p className="max-w-80 p-2 text-xs">
							En cliquant sur &quot;Voir la vidéo&quot;, vous acceptez
							que YouTube puisse collecter certaines données
							personnelles, comme décrit dans leur{" "}
							<a
								href="https://policies.google.com/privacy"
								target="_blank"
								rel="noopener noreferrer"
								className="underline hover:text-blue-500"
							>
								politique de confidentialité.
							</a>
						</p>
					</div>
				</div>
			) : (
				<iframe
					width="560"
					height="315"
					src="https://www.youtube-nocookie.com/embed/gfU1iZnjRZM?si=rcErTfPeKrdWm8YY"
					title="YouTube video player"
					className="max-w-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
				></iframe>
			)}
		</>
	);
};

export default YoutubeComponent;
