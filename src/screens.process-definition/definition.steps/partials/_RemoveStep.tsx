import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";

export const RemoveStep = () => {
	const {
		definitionSteps,
		definitionStepActionIndex,
		openRemoveStepModal,
		innerIndex,
		setOpenRemoveStepModal,
		setDefinitionSteps,
		setCanSave,
		setDefinitionStepActionIndex,
		setInnerIndex,
	} = useContext(DefinitionContext);
	const { t } = useTranslation();

	if (!definitionSteps?.length) {
		return <></>;
	}

	return (
		<Modal isOpen={openRemoveStepModal}>
			<h2 className="typo-h3 mb-12">
				{t("removeStep", { defaultValue: "Remove Step" })}
			</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();

					setDefinitionSteps((previous) => {
						const next = [...(previous || [])];
						const index = Number(definitionStepActionIndex);

						next.splice(index, 1);

						if (next.length === 0) {
							setInnerIndex(undefined);
						} else if (innerIndex !== undefined && innerIndex > 0) {
							setInnerIndex(innerIndex - 1);
						}

						return [...next];
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
