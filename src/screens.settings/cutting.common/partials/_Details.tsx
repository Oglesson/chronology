import { useTranslation } from "react-i18next";
import { EditableField } from "../../../components/edit/EditableField";
import { EditableSection } from "../../../components/edit/EditableSection";
import {
	useCuttingMethodsNatural,
	useCuttingMethodsSynthetic,
} from "../../../hooks.queries/useCuttingMethods";
import { useCuttingTypes } from "../../../hooks.queries/useCuttingTypes";
import { useDefaultCuttingSettings } from "../../../hooks.queries/useDefaultCuttingSettings";
import { useFeedSystems } from "../../../hooks.queries/useFeedSystems";
import { useMaterialTypes } from "../../../hooks.queries/useMaterialTypes";
import { useUnits } from "../../../hooks.queries/useUnits";
import {
	useAreaFieldSchema,
	useCoefficientFieldSchema,
	useDepthFieldSchema,
	useLayersFieldSchema,
	useLengthFieldSchema,
	useSizesFieldSchema,
	useUnitsPerJobFieldSchema,
	useWidthFieldSchema,
} from "../../../hooks.schema/fields";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";

export const Details = () => {
	const { t } = useTranslation();
	const settings = useDefaultCuttingSettings();
	const { cuttingMethodNaturalOptions } = useCuttingMethodsNatural();
	const { cuttingMethodSyntheticOptions } = useCuttingMethodsSynthetic();
	const { cuttingTypeOptions } = useCuttingTypes();
	const { feedSystemOptions } = useFeedSystems();
	const { materialTypeOptions } = useMaterialTypes();
	const { unitOptions } = useUnits();
	const unitsPerJobFieldSchema = useUnitsPerJobFieldSchema();
	const sizesFieldSchema = useSizesFieldSchema();
	const layersFieldSchema = useLayersFieldSchema();
	const widthFieldSchema = useWidthFieldSchema();
	const lengthFieldSchema = useLengthFieldSchema();
	const depthFieldSchema = useDepthFieldSchema();
	const areaFieldSchema = useAreaFieldSchema();
	const coefficientFieldSchema = useCoefficientFieldSchema();
	const { permissions } = usePermissionsContext();

	return (
		<EditableSection>
			<>
				<div className="grid-container">
					<div className="col-span-4">
						<h4 className="typo-h4">{t("cuttingDefaults")}</h4>
					</div>
					<div className="col-span-8">
						<EditableField
							defaultElement={
								<p className="max-w-[12rem]">
									{settings._Materialtype?.Description.replace(
										"*_",
										"",
									)}
								</p>
							}
							defaultValue={materialTypeOptions}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="materialType"
							inputType="select"
							label={t("materialType")}
							selectedValue={settings.MaterialtypeID}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[12rem]">
									{settings._Cuttingtype?.Description.replace(
										"*_",
										"",
									)}
								</p>
							}
							defaultValue={cuttingTypeOptions}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="cuttingType"
							inputType="select"
							label={t("cuttingType")}
							selectedValue={settings.CuttingtypeID}
							tooltipContent={t("settingsCuttingTypeToolTip")}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[12rem]">
									{settings._Units?.Description.replace(
										"*_",
										"",
									)}
								</p>
							}
							defaultValue={unitOptions}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="units"
							inputType="select"
							label={t("units")}
							selectedValue={settings.UnitsID}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[6rem]">
									{settings.UnitsPerJob}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="unitsPerJob"
							inputType="number"
							label={t("itemsPerJob")}
							schema={unitsPerJobFieldSchema}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[6rem]">{settings.Sizes}</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="sizes"
							inputType="number"
							label={t("sizes")}
							schema={sizesFieldSchema}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[12rem]">
									{settings._Cuttingmethodnatural?.Description.replace(
										"*_",
										"",
									)}
								</p>
							}
							defaultValue={cuttingMethodNaturalOptions}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="cuttingMethodNatural"
							inputType="select"
							label={t("cuttingMethodNatural")}
							selectedValue={settings.CuttingmethodnaturalID}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[12rem]">
									{settings._Cuttingmethodsynthetic?.Description.replace(
										"*_",
										"",
									)}
								</p>
							}
							defaultValue={cuttingMethodSyntheticOptions}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="cuttingMethodSynthetic"
							inputType="select"
							label={t("cuttingMethodSynthetic")}
							selectedValue={settings.CuttingmethodsyntheticID}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[12rem]">
									{settings._Feedsystem?.Description.replace(
										"*_",
										"",
									)}
								</p>
							}
							defaultValue={feedSystemOptions}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="feedSystem"
							inputType="select"
							label={t("feedSystem")}
							selectedValue={settings.FeedsystemID}
							tooltipContent={t("settingsFeedSysToolTip")}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[6rem]">
									{settings.Layers}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="layers"
							inputType="number"
							label={t("layers")}
							schema={layersFieldSchema}
							tooltipContent={t("settingsLayersToolTip")}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[6rem]">
									{settings.Width
										? settings.Width.toFixed(3)
										: "0.000"}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="width"
							inputType="number"
							label={t("width")}
							schema={widthFieldSchema}
							tooltipContent={t("settingsWidthToolTip")}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[6rem]">
									{settings.Length
										? settings.Length.toFixed(3)
										: "0.000"}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="fabricLength"
							inputType="number"
							label={t("length")}
							schema={lengthFieldSchema}
							tooltipContent={t("settingsLengthToolTip")}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[6rem]">
									{settings.Depth
										? settings.Depth.toFixed(3)
										: "0.000"}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="depth"
							inputType="number"
							label={t("depth")}
							schema={depthFieldSchema}
							tooltipContent={t("settingsDepthToolTip")}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[6rem]">
									{settings.Area
										? settings.Area.toFixed(3)
										: "0.000"}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="area"
							inputType="number"
							label={t("area")}
							schema={areaFieldSchema}
							tooltipContent={t("settingsAreaToolTip")}
						/>
						<EditableField
							defaultElement={
								<p className="max-w-[6rem]">
									{settings.Coefficient}
								</p>
							}
							disableEdit={!(permissions?.edit || permissions?.admin)}
							inline={true}
							inputName="coefficient"
							inputType="number"
							label={t("coefficient")}
							schema={coefficientFieldSchema}
							tooltipContent={t("settingsCoeffiToolTip")}
						/>
					</div>
				</div>
			</>
		</EditableSection>
	);
};
