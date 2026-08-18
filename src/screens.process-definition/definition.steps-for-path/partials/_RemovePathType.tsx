import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";

export const RemovePathType = () => {
	const {
		pathTypes,
		pathTypeActionIndex,
		openRemovePathTypeModal,
		setOpenRemovePathTypeModal,
		setPathTypes,
		setCanSave,
	} = useContext(DefinitionContext);
	const { t } = useTranslation();

	if (!pathTypes?.length) {
		return <></>;
	}

	return (
		<Modal isOpen={openRemovePathTypeModal}>
			<h2 className="typo-h3 mb-12">{t("removePathType")}</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();

					setPathTypes((previous) => {
						const next = [...(previous || [])];

						next.splice(Number(pathTypeActionIndex), 1);

						next.forEach((pathType, index) => {
							pathType.Seq = index + 1;
						});

						return next;
					});

					setOpenRemovePathTypeModal();
					setCanSave(true);
				}}
			>
				<div className="flex justify-end items-end mt-12 gap-6">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={setOpenRemovePathTypeModal}
					/>
					<Button text={t("remove")} theme="decline" type="submit" />
				</div>
			</form>
		</Modal>
	);
};
