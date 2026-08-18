import { useTranslation } from "react-i18next";
import { EditableField } from "../../components/edit/EditableField";
import { EditableSection } from "../../components/edit/EditableSection";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { useStitchingCharacteristics } from "../../hooks.queries/useStitchingCharacteristics";
import {
	useMachineTypePostNotFlatFieldSchema,
	useMaterialPropertyFloppyNotNormalFieldSchema,
	useNeedleTypeTwinNotSingleFieldSchema,
} from "../../hooks.schema/fields";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

export const StitchingCharacteristics = () => {
	const materialPropertyFloppyNotNormalFieldSchema =
		useMaterialPropertyFloppyNotNormalFieldSchema();
	const machineTypePostNotFlatFieldSchema =
		useMachineTypePostNotFlatFieldSchema();
	const needleTypeTwinNotSingleFieldSchema =
		useNeedleTypeTwinNotSingleFieldSchema();
	const stitchingCharacteristics = useStitchingCharacteristics();
	const { t } = useTranslation();
	const identifier = FORM_IDENTIFIERS.updateStitchingCharacteristics;
	const { permissions } = usePermissionsContext();

	return (
		<EditableSection>
			<div className="grid-container gap-y-6">
				<div className="col-span-12 lg:col-span-3">
					<EditableField
						defaultElement={
							<p className="typo-h5 max-w-[6rem]">
								{
									stitchingCharacteristics.MaterialPropertyFloppy
								}
							</p>
						}
						disableEdit={!(permissions?.edit || permissions?.admin)}
						identifier={identifier}
						inputName="materialPropertyFloppy"
						inputType="number"
						label={t("materialPropertyFloppyNotNormal")}
						schema={materialPropertyFloppyNotNormalFieldSchema}
					/>
				</div>
				<div className="col-span-12 lg:col-span-3">
					<EditableField
						defaultElement={
							<p className="typo-h5 max-w-[6rem]">
								{stitchingCharacteristics.MachineTypePost}
							</p>
						}
						disableEdit={!(permissions?.edit || permissions?.admin)}
						identifier={identifier}
						inputName="machineTypePost"
						inputType="number"
						label={t("machineTypePostNotFlat")}
						schema={machineTypePostNotFlatFieldSchema}
					/>
				</div>
				<div className="col-span-12 lg:col-span-3">
					<EditableField
						defaultElement={
							<p className="typo-h5 max-w-[6rem]">
								{stitchingCharacteristics.NeedleTypeTwin}
							</p>
						}
						disableEdit={!(permissions?.edit || permissions?.admin)}
						identifier={identifier}
						inputName="needleTypeTwin"
						inputType="number"
						label={t("needleTypeTwinNotSingle")}
						schema={needleTypeTwinNotSingleFieldSchema}
					/>
				</div>
			</div>
		</EditableSection>
	);
};
