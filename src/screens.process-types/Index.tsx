import { AwaitLoaderData } from "../components/common/loader/AwaitLoaderData";
import { usePermissionsContext } from "../hooks.common/usePermissionsContext";
import { Classes } from "./partials/_Classes";
import { CreateClass } from "./partials/_CreateClass";
import { CreateTypeModal } from "./partials/_CreateType";

export const ProcessTypes = () => {
	const { permissions } = usePermissionsContext();

	return (
		<AwaitLoaderData>
			<Classes />
			{(permissions?.edit || permissions?.admin) && <CreateClass />}
			{(permissions?.edit || permissions?.admin) && <CreateTypeModal />}
		</AwaitLoaderData>
	);
};
