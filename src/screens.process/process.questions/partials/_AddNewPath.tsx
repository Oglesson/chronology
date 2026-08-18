import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import api from "../../../api.common";
import { FeatureData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { FileInput } from "../../../forms.common/FileInput";
import { useToggle } from "../../../hooks.common/useToggle";
import { useQuestionsContext } from "../../../hooks.queries/useQuestionsContext";
import { usePathFileFieldSchema } from "../../../hooks.schema/fields";
import { QuestionsContext } from "./_QuestionsContext";

export const AddNewPath = () => {
	const pathFileFieldSchema = usePathFileFieldSchema();
	const [openModal, setOpenModal] = useToggle(false);
	const {
		activeGroupId,
		getGroupState,
		setGroupState,
		setPathsQuestionsState,
		setAvailablePaths,
	} = useQuestionsContext();
	const { formHasChanged } = useContext(QuestionsContext);
	const { t } = useTranslation();
	const {
		register,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(pathFileFieldSchema),
	});
	const onSubmit = async () => {
		const { pathFile } = getValues();

		if (!pathFile) {
			return;
		}

		const pathFileFormData = new FormData();

		pathFileFormData.append("Filename", pathFile[0]);

		await api.uploadPathFile(pathFileFormData);
		const content = await api.getPathFileContent(pathFile[0].name);

		if (content.status !== 200) {
			setOpenModal();
			return;
		}

		const paths = content.data.Paths.map((path) => {
			return path.Points.map((p) => {
				return {
					X: p.X,
					Y: p.Y,
					RawPoint: p.RawPoint,
					PathType: p.PathType,
					PointType: p.PointType,
					Features: p.Features.map((f) => {
						return {
							FeatureID: f.ID,
							_Feature: {
								Code: f.Code,
								Description: f.Description,
							},
						} as FeatureData;
					}),
				};
			});
		});

		if (paths.length === 1) {
			setPathsQuestionsState({
				answered: true,
				value: paths[0],
			});
			setAvailablePaths([]);
			const {
				next,
				group: { isDirty },
			} = getGroupState(activeGroupId as number);
			setGroupState(
				activeGroupId as number,
				!isDirty && next === "incomplete" ? "initial" : next
			);
		} else {
			setPathsQuestionsState((previous) => {
				const next = { ...previous, value: [...previous.value] };
				next.value = [];
				return next;
			});
			setAvailablePaths(paths);
		}

		formHasChanged("Points");
		setOpenModal();
	};
	const onSubmitError = (data: object) => console.error(data);

	useEffect(() => {
		if (openModal) {
			reset();
		}
	}, [openModal, reset]);

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setOpenModal();
				}}
			>
				{t("newPath")}
			</button>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">
					{t("addANewPath", {
						defaultValue: "Add a new Path",
					})}
				</h2>
				<form
					onSubmit={(e) => handleSubmit(onSubmit, onSubmitError)(e)}
				>
					<FileInput
						accept=".dig"
						error={errors.pathFile}
						htmlFor={"pathFile"}
						icon={Icons.Interface.Media}
						label={t("pathFile")}
						name="pathFile"
						placeholder="Drop file here or click to upload"
						register={register}
					/>
					<div className="flex justify-end items-center mt-12 gap-6">
						<Button
							style="secondary"
							text={t("cancel")}
							onClick={setOpenModal}
						/>
						<Button text={t("add")} type="submit" />
					</div>
				</form>
			</Modal>
		</>
	);
};
