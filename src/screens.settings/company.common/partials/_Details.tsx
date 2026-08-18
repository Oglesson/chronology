import { useTranslation } from "react-i18next";
import { EditableField } from "../../../components/edit/EditableField";
import { EditableSection } from "../../../components/edit/EditableSection";
import { useGeneralSettings } from "../../../hooks.queries/useGeneralSettings";
import {
	useDefaultMadeInPairsFieldSchema,
	useMinutesInDayFieldSchema,
} from "../../../hooks.schema/fields";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";

export const Details = () => {
	const generalSettings = useGeneralSettings();
	const { t } = useTranslation();
	const defaultMadeInPairsFieldSchema = useDefaultMadeInPairsFieldSchema();
	const minutesInDayFieldSchema = useMinutesInDayFieldSchema();
	const { permissions } = usePermissionsContext();

	return (
		<EditableSection>
			<div className="space-y-7">
				<EditableField
					defaultElement={<p className="typo-h5">{t("shoes")}</p>}
					inputName="items"
					disableEdit={true}
					label={t("items")}
				/>

				<EditableField
					defaultElement={
						<p className="typo-h5 max-w-[6rem]">
							{generalSettings.MinutesInDay}
						</p>
					}
					disableEdit={!(permissions?.edit || permissions?.admin)}
					inputName="minutesInDay"
					inputType="number"
					label={t("minutesInDay")}
					schema={minutesInDayFieldSchema}
				/>

				<EditableField
					defaultElement={
						<p className="typo-h5 max-w-[13rem]">
							{generalSettings.DefaultMadeInPairs
								? t("yes")
								: t("no")}
						</p>
					}
					defaultValue={[
						{ label: "Yes", value: "yes" },
						{ label: "No", value: "no" },
					]}
					disableEdit={!(permissions?.edit || permissions?.admin)}
					inputName="defaultMadeInPairs"
					inputType="select"
					label={t("madeInPairs")}
					selectedValue={
						generalSettings.DefaultMadeInPairs ? "yes" : "no"
					}
					schema={defaultMadeInPairsFieldSchema}
				/>
			</div>
		</EditableSection>
	);
};
