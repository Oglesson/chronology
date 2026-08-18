import { useTranslation } from "react-i18next";
import { ItemActionsMenu } from "../../components/ItemActionsMenu/ItemActionsMenu";
import { EditableField } from "../../components/edit/EditableField";
import { EditableSection } from "../../components/edit/EditableSection";
import Icons from "../../config.common/Icons";
import { useAction } from "../../hooks.queries/useAction";
import {
	useCodeFieldSchema,
	useDescriptionFieldSchema,
	useReflectLevelFieldSchema,
	useSecsAt100FieldSchema,
} from "../../hooks.schema/fields";
import { Delete } from "./_Delete";
import { Copy } from "./_Copy";
import { useActions } from "../../hooks.queries/useActions";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { Tooltip } from "../../components/common/tooltip/Tooltip";

export const Details = () => {
	const action = useAction();
	const { actionCodes } = useActions();
	const { t } = useTranslation();
	const descriptionFieldSchema = useDescriptionFieldSchema();
	const reflectLevelFieldSchema = useReflectLevelFieldSchema();
	const secsAt100FieldSchema = useSecsAt100FieldSchema();
	const { permissions } = usePermissionsContext();
	const codeFieldSchema = useCodeFieldSchema(actionCodes, action?.Code);

	if (!action) {
		return <></>;
	}

	return (
		<div className="relative">
			<div className="absolute top-10 right-0">
				<ItemActionsMenu
					actions={[
						{
							step: (data) =>
								(permissions?.edit || permissions?.admin) && (
									<Copy action={data} />
								),
						},
						{
							step: (data) =>
								(permissions?.edit || permissions?.admin) && (
									<Delete action={data} />
								),
						},
					]}
					data={action}
					buttonIcon={Icons.Interface.MoreHorizontal}
					buttonLabel={t("moreActions")}
				/>
			</div>
			<EditableSection>
				<div className="grid-container gap-y-7 mt-6">
					<div className="col-span-12 xl:col-span-12 mb-7 grid-container">
						<EditableField
							defaultElement={
								<h1 className="typo-large">{action.Code}</h1>
							}
							disableEdit={
								!(permissions?.edit || permissions?.admin) ||
								action.System
							}
							inputName="code"
							label={t("code")}
							schema={codeFieldSchema}
							className="col-span-9"
						/>
						{action.System && (
							<Tooltip
								placement="left"
								content={t("tooltipEditAction")}
								strategy="hover"
								className="self-center mt-6 col-span-1"
							>
								<RenderIcon
									icon={Icons.Edit.Remove}
									classes="self-center mt-6 col-span-1"
									sizes="w-16 h-16"
								/>
							</Tooltip>
						)}
					</div>
					<div className="col-span-12 lg:col-span-6 lg:row-start-2">
						<EditableField
							defaultElement={
								<p className="typo-h5">{action.Description}</p>
							}
							disableEdit={
								!(permissions?.edit || permissions?.admin) ||
								action.System
							}
							inputName="description"
							label={t("description")}
							schema={descriptionFieldSchema}
						/>
						<EditableField
							className="mt-7"
							defaultElement={
								<p className="typo-h5 max-w-[13rem]">
									{action.ReflectLevel ? t("yes") : t("no")}
								</p>
							}
							defaultValue={[
								{ label: t("yes"), value: "yes" },
								{ label: t("no"), value: "no" },
							]}
							disableEdit={
								!(permissions?.edit || permissions?.admin) ||
								action.System
							}
							inputName="reflectLevel"
							inputType="select"
							label={t("reflectPerformanceLevel")}
							selectedValue={action.ReflectLevel ? "yes" : "no"}
							schema={reflectLevelFieldSchema}
						/>
					</div>
					<div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:row-start-2">
						<EditableField
							defaultElement={
								<p className="typo-h1 max-w-[15rem]">
									{action.SecsAt100?.toFixed(4)}
								</p>
							}
							disableEdit={
								!(permissions?.edit || permissions?.admin) ||
								action.System
							}
							inputName="secsAt100"
							inputType="number"
							label={t("secondsAt100Performance")}
							schema={secsAt100FieldSchema}
						/>
					</div>
				</div>
			</EditableSection>
		</div>
	);
};
