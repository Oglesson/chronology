import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { Details } from "./partials/_Details";
import { Processes } from "./partials/_Processes";
import { ProcessSetContextProvider } from "./partials/_ProcessSetContext";
import { Save } from "./partials/_Save";

export const ProcessSet = () => {
	const { permissions } = usePermissionsContext();

	return (
		<AwaitLoaderData>
			<ProcessSetContextProvider>
				<Details />
				<Processes />
				{(permissions?.edit || permissions?.admin) && <Save />}
			</ProcessSetContextProvider>
		</AwaitLoaderData>
	);
};
