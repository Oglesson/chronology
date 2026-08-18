import { useTranslation } from "react-i18next";
import { EditableField } from "../../components/edit/EditableField";
import { EditableImage } from "../../components/edit/EditableImage";
import { useDesign } from "../../hooks.queries/useDesign";
import { useDesignFile } from "../../hooks.queries/useDesignFile";
import { useNotesFieldSchema } from "../../hooks.schema/fields";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

export const About = () => {
	const style = useDesign();
	const notesFieldSchema = useNotesFieldSchema();
	const { filePath, fileName } = useDesignFile(style.PhotoURL || "");
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<div className="grid-container">
			<div className="col-span-6">
				<EditableField
					defaultElement={
						<p className="typo-h4 text-grey-light whitespace-pre-line">
							{style.Notes}
						</p>
					}
					disableEdit={!(permissions?.edit || permissions?.admin)}
					inputType="textarea"
					inputName="notes"
					label={t("notes")}
					schema={notesFieldSchema}
				/>
			</div>
			<div className="col-span-5 col-start-7">
				<EditableImage
					htmlFor="photo"
					imageAltText={fileName}
					imageClasses="rounded-md"
					imageSrc={filePath}
					inputName="photo"
					labelText="Image"
					disableEdit={!(permissions?.edit || permissions?.admin)}
				/>
			</div>
		</div>
	);
};
