"use client";

import dynamic from "next/dynamic";
import React from "react";

const GamePage = dynamic(
	async () => import("@/components/GamePage").then((mod) => mod.GamePage),
	{
		ssr: false,
	},
);

function RootPage() {
	return <GamePage />;
}

export default dynamic(async () => Promise.resolve(RootPage), {
	ssr: false,
});
