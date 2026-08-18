import { useTranslation } from "react-i18next";
import { EditableField } from "../../../components/edit/EditableField";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { usePathSimoFieldSchema } from "../../../hooks.schema/fields";
import { Save } from "../../definition.index/partials/_Save";
import { PathTypes } from "./_PathTypes";

export const Details = () => {
	const definition = useProcessDefinition();
	const usePath = definition.InnerIndex && definition.InnerIndex > -1;
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();
	const pathSimoFieldSchema = usePathSimoFieldSchema();

	return (
		<>
			<div>
				<div className="grid-container gap-y-7 mt-6">
					<div className="col-span-12 lg:col-span-3 mb-7">
						<span className="block text-grey-light mb-1.5">
							{t("usePath")}
						</span>
						<p className="typo-h5">
							{usePath ? t("yes") : t("no")}
						</p>
					</div>
					<div className="col-span-12 lg:col-span-6">
						<EditableField
							defaultElement={
								<p className="typo-h5">{definition.PathSimo}</p>
							}
							disableEdit={
								!(permissions?.edit || permissions?.admin) || definition.IsInUse
							}
							inputName="pathSimo"
							inputType="number"
							label={t("pathSimo")}
							schema={pathSimoFieldSchema}
						/>
					</div>
				</div>
				<PathTypes />
			</div>
			{(permissions?.edit || permissions?.admin) && !definition.IsInUseByOp && <Save />}
		</>
	);
};
