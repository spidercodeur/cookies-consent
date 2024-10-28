"use client";
import React from "react";
import { useCookies } from "../context/CookiesContext";

const AnalyticsComponent = () => {
	const { isServiceEnabled, isLoading } = useCookies();

	if (isLoading) return null;

	if (!isServiceEnabled(1)) {
		return <span className="text-red-600">Google Analytics non actif</span>;
	}

	return <span className="text-green-600">Google Analytics actif</span>;
};

export default AnalyticsComponent;
