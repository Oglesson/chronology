import { useContext } from "react";
import { PermissionsContext } from "../layout.common/PermissionsContext";

export const usePermissionsContext = () => {
	const { permissions } = useContext(PermissionsContext);

	return { permissions };
};
