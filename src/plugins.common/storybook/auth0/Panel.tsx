import { useAddonState } from "@storybook/api";
import { AddonPanel } from "@storybook/components";
import React from "react";
import { PanelContent } from "./components/PanelContent";
import { ADDON_ID } from "./constants";

interface PanelProps {
	active: boolean;
}

export const Panel: React.FC<PanelProps> = (props) => {
	// https://storybook.js.org/docs/react/addons/addons-api#useaddonstate
	useAddonState(ADDON_ID, {
		isLoading: false,
		isAuthenticated: false,
	});

	// https://storybook.js.org/docs/react/addons/addons-api#usechannel
	return (
		<AddonPanel {...props}>
			<PanelContent />
		</AddonPanel>
	);
};
