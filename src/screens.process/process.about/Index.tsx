import { useTranslation } from "react-i18next";
import { EditableField } from "../../components/edit/EditableField";
import { EditableImage } from "../../components/edit/EditableImage";
import { useProcess } from "../../hooks.queries/useProcess";
import { useProcessFile } from "../../hooks.queries/useProcessFile";
import { useNotesFieldSchema } from "../../hooks.schema/fields";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

export const About = () => {
	const { Notes, PhotoURL, CreationStatus } = useProcess();
	const isImported = CreationStatus === "ocsImported";
	const { fileName, filePath } = useProcessFile(PhotoURL || "");
	const notesFieldSchema = useNotesFieldSchema();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<div className="grid-container">
			<div className="col-span-6">
				<EditableField
					defaultElement={
						<p className="typo-h4 text-grey-light whitespace-pre-line">
							{Notes}
						</p>
					}
					inputType="textarea"
					inputName="notes"
					label={t("notes")}
					schema={notesFieldSchema}
					placeholder={
						isImported
							? ""
							: t("addNote", {
									defaultValue: "Add a note...",
								})
					}
					disableEdit={!(permissions?.edit || permissions?.admin) || isImported}
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
					disableEdit={!(permissions?.edit || permissions?.admin) || isImported}
				/>
			</div>
		</div>
	);
};
