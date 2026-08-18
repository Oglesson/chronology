import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ItemActionsMenu } from "../../components/ItemActionsMenu/ItemActionsMenu";
import { EditableField } from "../../components/edit/EditableField";
import { EditableSection } from "../../components/edit/EditableSection";
import { DropdownTabs } from "../../components/tabs/DropdownTabs";
import Icons from "../../config.common/Icons";
import { useStep } from "../../hooks.queries/useStep";
import { useSteps } from "../../hooks.queries/useSteps";
import {
	useCodeFieldSchema,
	useDescriptionFieldSchema,
	useValueAddedFieldSchema,
} from "../../hooks.schema/fields";
import { Copy } from "./_Copy";
import { Delete } from "./_Delete";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { ItemsContext } from "./_ActionItemsContext";

export const Details = () => {
	const { step } = useStep();
	const { stepCodes } = useSteps();
	const { t } = useTranslation();
	const descriptionFieldSchema = useDescriptionFieldSchema();
	const valueAddedFieldSchema = useValueAddedFieldSchema();
	const codeFieldSchema = useCodeFieldSchema(stepCodes, step?.Code);
	const { canSave } = useContext(ItemsContext);
	const { permissions } = usePermissionsContext();

	if (!step) {
		return <></>;
	}

	return (
		<div key={step?.ID} className="relative mb-16">
			<div className="absolute top-10 right-0">
				<ItemActionsMenu
					actions={[
						{
							step: (data) =>
								(permissions?.edit || permissions?.admin) && (
									<Copy step={data} />
								),
						},
						{
							step: (data) =>
								(permissions?.edit || permissions?.admin) && (
									<Delete step={data} />
								),
						},
					]}
					data={step}
					buttonIcon={Icons.Interface.MoreHorizontal}
					buttonLabel={t("moreActions")}
				/>
			</div>
			<EditableSection>
				<div className="grid-container gap-y-7 mt-6">
					<div className="col-span-12 xl:col-span-10 mb-7">
						<EditableField
							defaultElement={
								<h1 className="typo-large">{step.Code}</h1>
							}
							disableEdit={
								!(permissions?.edit || permissions?.admin)
							}
							inputName="code"
							label={t("code")}
							schema={codeFieldSchema}
						/>
					</div>
					<div className="col-span-12 lg:col-span-6 lg:row-start-2">
						<EditableField
							defaultElement={
								<p className="typo-h5">{step.Description}</p>
							}
							disableEdit={
								!(permissions?.edit || permissions?.admin)
							}
							inputName="description"
							label={t("description")}
							schema={descriptionFieldSchema}
						/>
						<EditableField
							className="mt-7"
							defaultElement={
								<p className="typo-h5 max-w-[13rem]">
									{step.ValueAdded ? t("yes") : t("no")}
								</p>
							}
							defaultValue={[
								{ label: t("yes"), value: "yes" },
								{ label: t("no"), value: "no" },
							]}
							disableEdit={
								!(permissions?.edit || permissions?.admin)
							}
							inputName="valueAdded"
							inputType="select"
							label={t("valueAdded")}
							selectedValue={step.ValueAdded ? "yes" : "no"}
							schema={valueAddedFieldSchema}
						/>
					</div>
					<div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:row-start-2">
						<DropdownTabs
							classes="inline-block min-w-[134px]"
							tabs={[
								{
									content: (
										<p className="typo-h1">
											{!canSave ? (
												step.Time_Minutes?.toFixed(4)
											) : (
												<>&ndash;</>
											)}
										</p>
									),
									label: t("minutes"),
									value: "minutes",
								},
								{
									content: (
										<p className="typo-h1">
											{!canSave ? (
												step.Time_Seconds?.toFixed(1)
											) : (
												<>&ndash;</>
											)}
										</p>
									),
									label: t("seconds"),
									value: "seconds",
								},
							]}
							defaultValue="seconds"
						/>
					</div>
				</div>
			</EditableSection>
		</div>
	);
};
