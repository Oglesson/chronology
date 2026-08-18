import { useTranslation } from "react-i18next";
import { Tooltip } from "../../components/common/tooltip/Tooltip";
import { EditableField } from "../../components/edit/EditableField";
import { EditableGroup } from "../../components/edit/EditableGroup";
import { EditableSection } from "../../components/edit/EditableSection";
import Icons from "../../config.common/Icons";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { useProcessDefinitionsMachining } from "../../hooks.queries/useProcessDefinitionsMachining";
import {
	useDensityPerInchDpsFieldSchema,
	useDensityPerInchMaximumFieldSchema,
	useDensityPerInchMinimumFieldSchema,
	useMaximumSpeedMaximumFieldSchema,
	useMaximumSpeedMinimumFieldSchema,
	useMinimumSpeedMaximumFieldSchema,
	useMinimumSpeedMinimumFieldSchema,
	usePalletDensityPerInchDpsFieldSchema,
	usePalletDensityPerInchMaximumFieldSchema,
	usePalletDensityPerInchMinimumFieldSchema,
	usePalletDensityPerInchDefaultFieldSchema,
	usePalletProgrammedMaximumSpeedFieldSchema,
	usePalletProgrammedMinimumSpeedFieldSchema,
	useDensityPerInchDefaultFieldSchema,
} from "../../hooks.schema/fields";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { useSystemStitchingModifiers } from "../../hooks.queries/useSystemStitchingModifiers";

export const PalletStitching = () => {
	const palletProgrammedMinimumSpeedFieldSchema =
		usePalletProgrammedMinimumSpeedFieldSchema();
	const palletProgrammedMaximumSpeedFieldSchema =
		usePalletProgrammedMaximumSpeedFieldSchema();
	const palletDensityPerInchMaximumFieldSchema =
		usePalletDensityPerInchMaximumFieldSchema();
	const palletDensityPerInchMinimumFieldSchema =
		usePalletDensityPerInchMinimumFieldSchema();
	const palletDensityPerInchDpsFieldSchema =
		usePalletDensityPerInchDpsFieldSchema();
	const palletDensityPerInchDefaultFieldSchema =
		usePalletDensityPerInchDefaultFieldSchema();

	const processDefinitionsMachining = useProcessDefinitionsMachining();
	const { t } = useTranslation();
	const identifier = FORM_IDENTIFIERS.updateStitchingFolding;
	const { permissions } = usePermissionsContext();

	return (
		<EditableSection>
			<EditableGroup>
				<div className="grid-container mb-10">
					<div className="col-span-4">
						<h4 className="typo-h4">{t("programmedSpeed")}</h4>
					</div>
					<div className="col-span-8">
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{
										processDefinitionsMachining.Pallet_ProgrammedSpeed_Min
									}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="pallet_ProgrammedSpeed_Min"
							inputType="number"
							label={t("minimum")}
							schema={palletProgrammedMinimumSpeedFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{
										processDefinitionsMachining.Pallet_ProgrammedSpeed_Max
									}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="pallet_ProgrammedSpeed_Max"
							inputType="number"
							label={t("maximum")}
							schema={palletProgrammedMaximumSpeedFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{
										processDefinitionsMachining.Pallet_ProgrammedSpeed_Default
									}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="pallet_ProgrammedSpeed_Default"
							inputType="number"
							label={t("default")}
							alignHorizontal="right"
						/>
					</div>
				</div>
			</EditableGroup>
			<EditableGroup>
				<div className="grid-container">
					<div className="col-span-4">
						<h4 className="typo-h4">{t("density")}</h4>
					</div>
					<div className="col-span-8">
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{processDefinitionsMachining.Pallet_Density_Min?.toFixed(
										2,
									)}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="pallet_Density_Min"
							inputType="number"
							label={t("minimum")}
							schema={palletDensityPerInchMinimumFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{processDefinitionsMachining.Pallet_Density_Max?.toFixed(
										2,
									)}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="pallet_Density_Max"
							inputType="number"
							label={t("maximum")}
							schema={palletDensityPerInchMaximumFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{processDefinitionsMachining.Pallet_Density_Default?.toFixed(
										2,
									)}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="pallet_Density_Default"
							inputType="number"
							label={t("default")}
							schema={palletDensityPerInchDefaultFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{
										processDefinitionsMachining.Pallet_Density_dps
									}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="pallet_Density_dps"
							inputType="number"
							label={t("decimalPlaces")}
							schema={palletDensityPerInchDpsFieldSchema}
							alignHorizontal="right"
						/>
					</div>
				</div>
			</EditableGroup>
		</EditableSection>
	);
};

export const StitchingFolding = () => {
	const minimumSpeedMinimumFieldSchema = useMinimumSpeedMinimumFieldSchema();
	const minimumSpeedMaximumFieldSchema = useMinimumSpeedMaximumFieldSchema();
	const maximumSpeedMinimumFieldSchema = useMaximumSpeedMinimumFieldSchema();
	const maximumSpeedMaximumFieldSchema = useMaximumSpeedMaximumFieldSchema();
	const densityPerInchMaximumFieldSchema =
		useDensityPerInchMaximumFieldSchema();
	const densityPerInchMinimumFieldSchema =
		useDensityPerInchMinimumFieldSchema();
	const densityPerInchDpsFieldSchema = useDensityPerInchDpsFieldSchema();
	const densityPerInchDefaultFieldSchema =
		useDensityPerInchDefaultFieldSchema();
	const processDefinitionsMachining = useProcessDefinitionsMachining();
	const { systemStitchingModifierOptions } = useSystemStitchingModifiers();
	const { t } = useTranslation();
	const identifier = FORM_IDENTIFIERS.updateStitchingFolding;
	const { permissions } = usePermissionsContext();

	return (
		<EditableSection>
			<EditableGroup>
				<div className="grid-container mb-10">
					<div className="col-span-4">
						<div className="flex items-baseline">
							<h4 className="typo-h4 mr-5">
								{t("maximumSpeed")}
							</h4>
							<Tooltip content={t("tooltipSystemMaxSpeed")}>
								<RenderIcon icon={Icons.Interface.Info} />
							</Tooltip>
						</div>
					</div>
					<div className="col-span-8">
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{
										processDefinitionsMachining.MaximumSpeed_Min
									}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="maximumSpeed_Min"
							inputType="number"
							label={t("minimum")}
							schema={maximumSpeedMinimumFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{
										processDefinitionsMachining.MaximumSpeed_Max
									}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="maximumSpeed_Max"
							inputType="number"
							label={t("maximum")}
							schema={maximumSpeedMaximumFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{
										processDefinitionsMachining.MaximumSpeed_Default
									}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="maximumSpeed_Default"
							inputType="number"
							label={t("default")}
							alignHorizontal="right"
						/>
					</div>
				</div>
			</EditableGroup>
			<EditableGroup>
				<div className="grid-container mb-10">
					<div className="col-span-4">
						<div className="flex items-baseline">
							<h4 className="typo-h4 mr-5">
								{t("minimumSpeed")}
							</h4>
							<Tooltip content={t("tooltipSystemMinSpeed")}>
								<RenderIcon icon={Icons.Interface.Info} />
							</Tooltip>
						</div>
					</div>
					<div className="col-span-8">
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{
										processDefinitionsMachining.MinimumSpeed_Min
									}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="minimumSpeed_Min"
							inputType="number"
							label={t("minimum")}
							schema={minimumSpeedMinimumFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{
										processDefinitionsMachining.MinimumSpeed_Max
									}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="minimumSpeed_Max"
							inputType="number"
							label={t("maximum")}
							schema={minimumSpeedMaximumFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{
										processDefinitionsMachining.MinimumSpeed_Default
									}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="minimumSpeed_Default"
							inputType="number"
							label={t("default")}
							alignHorizontal="right"
						/>
					</div>
				</div>
			</EditableGroup>
			<EditableGroup>
				<div className="grid-container mb-10">
					<div className="col-span-4">
						<h4 className="typo-h4">{t("densityPerInch")}</h4>
					</div>
					<div className="col-span-8">
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{processDefinitionsMachining.Density_Min?.toFixed(
										2,
									)}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="density_Min"
							inputType="number"
							label={t("minimum")}
							schema={densityPerInchMinimumFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{processDefinitionsMachining.Density_Max?.toFixed(
										2,
									)}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="density_Max"
							inputType="number"
							label={t("maximum")}
							schema={densityPerInchMaximumFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{processDefinitionsMachining.Density_Default?.toFixed(
										2,
									)}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="density_Default"
							inputType="number"
							label={t("default")}
							schema={densityPerInchDefaultFieldSchema}
							alignHorizontal="right"
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[6rem]">
									{processDefinitionsMachining.Density_dps}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="density_dps"
							inputType="number"
							label={t("decimalPlaces")}
							schema={densityPerInchDpsFieldSchema}
							alignHorizontal="right"
						/>
					</div>
				</div>
			</EditableGroup>
			<EditableGroup>
				<div className="grid-container">
					<div className="col-span-4">
						<h4 className="typo-h4">{t("other")}</h4>
					</div>
					<div className="col-span-8">
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[12rem]">
									{processDefinitionsMachining.MaterialPropertyFloppy
										? t("floppy")
										: t("normal")}
								</p>
							}
							defaultValue={[
								{ label: "Floppy", value: "yes" },
								{ label: "Normal", value: "no" },
							]}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="materialProperty"
							inputType="select"
							label={t("materialProperty")}
							selectedValue={
								processDefinitionsMachining.MaterialPropertyFloppy
									? "yes"
									: "no"
							}
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[12rem]">
									{processDefinitionsMachining.MachineTypePost
										? t("post")
										: t("flat")}
								</p>
							}
							defaultValue={[
								{ label: "Post", value: "yes" },
								{ label: "Flat", value: "no" },
							]}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="machineType"
							inputType="select"
							label={t("machineType")}
							selectedValue={
								processDefinitionsMachining.MachineTypePost
									? "yes"
									: "no"
							}
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[12rem]">
									{processDefinitionsMachining.NeedleTypeTwin
										? t("twin")
										: t("single")}
								</p>
							}
							defaultValue={[
								{ label: "Twin", value: "yes" },
								{ label: "Single", value: "no" },
							]}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="needleType"
							inputType="select"
							label={t("needleType")}
							selectedValue={
								processDefinitionsMachining.NeedleTypeTwin
									? "yes"
									: "no"
							}
						/>
						<EditableField
							identifier={identifier}
							defaultElement={
								<p className="max-w-[12rem]">
									{
										processDefinitionsMachining
											._Stitchingmodifier?.Description
									}
								</p>
							}
							defaultValue={systemStitchingModifierOptions}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="type"
							inputType="select"
							label={t("type")}
							selectedValue={
								processDefinitionsMachining._Stitchingmodifier
									?.ID
							}
						/>
					</div>
				</div>
			</EditableGroup>
		</EditableSection>
	);
};
