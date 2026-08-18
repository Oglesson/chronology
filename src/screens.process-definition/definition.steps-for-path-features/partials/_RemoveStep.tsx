import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";

export const RemoveStep = () => {
	const {
		definitionStepsForPathFeatures,
		definitionStepActionIndex,
		openRemoveStepModal,
		innerIndex,
		setOpenRemoveStepModal,
		setDefinitionStepsForPathFeatures,
		setCanSave,
		setDefinitionStepActionIndex,
		setInnerIndex,
	} = useContext(DefinitionContext);
	const { t } = useTranslation();

	if (!definitionStepsForPathFeatures?.length) {
		return <></>;
	}

	return (
		<Modal isOpen={openRemoveStepModal}>
			<h2 className="typo-h3 mb-12">{t("removeStep")}</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();

					setDefinitionStepsForPathFeatures((previous) => {
						const next = [...(previous || [])];
						const index = Number(definitionStepActionIndex);

						next.splice(index, 1);

						if (index + 1 === innerIndex) {
							setInnerIndex(-1);
						}

						return next;
					});

					setOpenRemoveStepModal();
					setCanSave(true);
					setDefinitionStepActionIndex(null);
				}}
			>
				<div className="flex justify-end items-end mt-12 gap-6">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={() => {
							setOpenRemoveStepModal();
							setDefinitionStepActionIndex(null);
						}}
					/>
					<Button text={t("remove")} theme="decline" type="submit" />
				</div>
			</form>
		</Modal>
	);
};
