import { useTranslation } from "react-i18next";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import { EditableField } from "../../../components/edit/EditableField";
import { EditableSection } from "../../../components/edit/EditableSection";
import Icons from "../../../config.common/Icons";
import { useDepartments } from "../../../hooks.queries/useDepartments";
import { useProcessSet } from "../../../hooks.queries/useProcessSet";
import {
	useCodeFieldSchema,
	useDescriptionFieldSchema,
} from "../../../hooks.schema/fields";
import { Delete } from "./_Delete";
import { useProcessSets } from "../../../hooks.queries/useProcessSets";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";

export const Details = () => {
	const processSet = useProcessSet();
	const { processSetCodes } = useProcessSets();
	const { departmentOptions } = useDepartments();
	const { t } = useTranslation();
	const descriptionFieldSchema = useDescriptionFieldSchema();
	const { permissions } = usePermissionsContext();

	return (
		<div className="relative">
			<div className="absolute top-10 right-0">
				<ItemActionsMenu
					actions={[
						{
							step: (data) => {
								return (
									(permissions?.edit ||
										permissions?.admin) && (
										<Delete processSet={data} />
									)
								);
							},
						},
					]}
					data={processSet}
					buttonIcon={Icons.Interface.MoreHorizontal}
					buttonLabel={t("moreActions", {
						defaultValue: "More Actions",
					})}
				/>
			</div>
			<EditableSection>
				<div className="grid-container gap-y-7 mt-6">
					<div className="col-span-12 xl:col-span-10 mb-7">
						<EditableField
							defaultElement={
								<h1 className="typo-large">
									{processSet?.Code}
								</h1>
							}
							disableEdit={
								!(permissions?.edit || permissions?.admin)
							}
							inputName="code"
							label={t("code")}
							schema={useCodeFieldSchema(
								processSetCodes,
								processSet?.Code,
							)}
						/>
					</div>
					<div className="col-span-12 lg:col-span-6 lg:row-start-2">
						<EditableField
							defaultElement={
								<p className="typo-h5">
									{processSet?.Description}
								</p>
							}
							disableEdit={
								!(permissions?.edit || permissions?.admin)
							}
							inputName="description"
							label={t("description")}
							schema={descriptionFieldSchema}
						/>
						<EditableField
							label={t("department")}
							className="mt-7"
							defaultElement={
								<span className="w-[12rem]">
									{processSet?._Department?.Description}
								</span>
							}
							defaultValue={departmentOptions}
							disableEdit={
								!(permissions?.edit || permissions?.admin)
							}
							inputName="departmentId"
							inputType="select"
							selectedValue={processSet?.DepartmentID}
						/>
					</div>
				</div>
			</EditableSection>
		</div>
	);
};
