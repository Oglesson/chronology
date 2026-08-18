import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { Save } from "../../definition.index/partials/_Save";
import { AddStep } from "./_AddStep";
import { List } from "./_List";

export const Details = () => {
	const definition = useProcessDefinition();
	const { permissions } = usePermissionsContext();

	return (
		<>
			{(permissions?.edit || permissions?.admin) && <AddStep />}
			<List />
			{(permissions?.edit || permissions?.admin) && !definition.IsInUseByOp && <Save />}
		</>
	);
};
