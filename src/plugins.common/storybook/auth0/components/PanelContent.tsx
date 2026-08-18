import { useParameter } from "@storybook/api";
import { Button } from "@storybook/components";
import { styled } from "@storybook/theming";
import React from "react";
import { defaultAuth0State, PARAM_KEY } from "../constants";

export const RequestDataButton = styled(Button)({
	marginTop: "1rem",
});

export const PanelContent: React.FC = () => {
	const value = useParameter(PARAM_KEY, { ...defaultAuth0State });

	return (
		<>
			<div>IsLoading: {value.isLoading ? "true" : "false"}</div>
			<div>
				IsAuthenticated: {value.isAuthenticated ? "true" : "false"}
			</div>
			<div>
				User:
				{value.user ? (
					<>{JSON.stringify(value.user)}</>
				) : (
					<> There is no user</>
				)}
			</div>
		</>
	);
};
