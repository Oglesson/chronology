import { Listing } from "./partials/_Listing";
import { AddDepartment } from "./partials/_AddDepartment";
import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

export const Style = () => {
	const { permissions } = usePermissionsContext();

	return (
		<AwaitLoaderData>
			<Listing />
			{(permissions?.edit || permissions?.admin) && <AddDepartment />}
		</AwaitLoaderData>
	);
};
