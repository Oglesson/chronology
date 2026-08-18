import { RouteObject } from "react-router-dom";
import { PrivacyPolicy } from "../screens.common/PrivacyPolicy";

export const privacyPolicyRoute: RouteObject = {
	path: "/privacy-policy",
	element: <PrivacyPolicy />,
};
