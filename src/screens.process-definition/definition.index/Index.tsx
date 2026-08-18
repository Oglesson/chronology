import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { useProcessDefinition } from "../../hooks.queries/useProcessDefinition";
import { DefinitionContextProvider } from "./partials/_DefinitionContext";
import { Groups } from "./partials/_Groups";
import { Save } from "./partials/_Save";

export const ProcessDefinition = () => {
	const definition = useProcessDefinition();
	const { permissions } = usePermissionsContext();

	return (
		<AwaitLoaderData>
			<DefinitionContextProvider>
				<Groups />
				{(permissions?.edit || permissions?.admin) && !definition.IsInUseByOp && <Save />}
			</DefinitionContextProvider>
		</AwaitLoaderData>
	);
};
