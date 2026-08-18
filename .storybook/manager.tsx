import React from "react";
import { addons, types } from "@storybook/addons";

import {
	ADDON_ID,
	PANEL_ID,
} from "../src/plugins.common/storybook/auth0/constants";
import { Panel } from "../src/plugins.common/storybook/auth0/Panel";

addons.register(ADDON_ID, () => {
	addons.add(PANEL_ID, {
		type: types.PANEL,
		title: "Auth0",
		match: ({ viewMode }) => viewMode === "story",
		render: ({ active, key }) => (
			<Panel active={active ?? true} key={key} />
		),
	});
});
