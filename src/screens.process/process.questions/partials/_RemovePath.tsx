import { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { useToggle } from "../../../hooks.common/useToggle";
import { useQuestionsContext } from "../../../hooks.queries/useQuestionsContext";
import { QuestionsContext } from "./_QuestionsContext";

export const RemovePath = () => {
	const [openModal, setOpenModal] = useToggle(false);
	const { pathsQuestionsState, setPathsQuestionsState } =
		useQuestionsContext();
	const { formHasChanged } = useContext(QuestionsContext);
	const { t } = useTranslation();
	const {
		handleSubmit,
		reset,
	} = useForm({});
	const onSubmit = async () => {
		setPathsQuestionsState({
			answered: false,
			value: [],
		});

		formHasChanged("Points");
		setOpenModal();
	};

	const onSubmitError = (data: object) => console.error(data);

	useEffect(() => {
		if (openModal) {
			reset();
		}
	}, [openModal, reset]);

	if (!pathsQuestionsState.value.length) {
		return <></>;
	}

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setOpenModal();
				}}
			>
				{t("removePath")}
			</button>
			<Modal isOpen={openModal}>
				<div className="max-w-[21rem]">
					<h3 className="typo-h3">{t("removePath")}</h3>
					<p className="mt-5">{t("removePathSummary")}</p>
				</div>
				<div className="flex justify-end items-end mt-16">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={setOpenModal}
					/>
					<form
						className="ml-6"
						onSubmit={(e) =>
							handleSubmit(onSubmit, onSubmitError)(e)
						}
					>
						<Button
							text={t("remove")}
							theme="decline"
							type="submit"
						/>
					</form>
				</div>
			</Modal>
		</>
	);
};
