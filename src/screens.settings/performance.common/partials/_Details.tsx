import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Level } from "../../../components/level/Level";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useToggle } from "../../../hooks.common/useToggle";
import { useGeneralSettings } from "../../../hooks.queries/useGeneralSettings";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../../utilities.common/ResponseDataUtilities";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { NotificationContext } from "../../../context.common/NotificationContext";

export const Details = () => {
	const generalSettings = useGeneralSettings();
	const { fetcher, isFetching, responseData } = useFetcher();

	const [currentValue, setCurrentValue] = useState<number>(
		generalSettings.LevelOn75To100,
	);
	const [tempValue, setTempValue] = useState<number>(
		generalSettings.LevelOn75To100,
	);
	const [modalValue, setModalValue] = useState<number>(
		generalSettings.LevelOn75To100,
	);
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();
	const { processResponse } = useContext(NotificationContext);

	useEffect(() => {
		if (responseData?.type === "success") {
			ResponseDataUtilities.resetResponseData(responseData);
			setOpenModal();
		} else if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData?.type, processResponse, setOpenModal, responseData]);

	return (
		<>
			<div className="grid mt-14">
				<div className="sm:row-start-1 sm:col-start-1">
					<Level
						callback={(value) => {
							setTempValue(currentValue);
							setCurrentValue(value);
							setModalValue(value);
							setOpenModal();
						}}
						disableEdit={!(permissions?.edit || permissions?.admin)}
						min={50}
						max={125}
						name="levelOn75To100"
						steps={{
							50: t("min"),
							75: t("base"),
							100: t("standard"),
							125: t("max"),
						}}
						value={currentValue}
					/>
				</div>
			</div>
			{(permissions?.edit || permissions?.admin) && (
				<Modal isOpen={openModal}>
					<h2 className="typo-h3 mb-5">
						{(modalValue > tempValue
							? t("performanceIncreaseMessage")
							: t("performanceDecreaseMessage")
						).replace("%%VALUE%%", modalValue.toString())}
					</h2>
					<p>{t("performanceChangeSummary")}</p>
					<fetcher.Form method="put" action="">
						<input
							type="hidden"
							name="levelOn75To100"
							value={currentValue}
						/>
						<div className="flex justify-end items-center mt-12 gap-6">
							{isFetching && (
								<RenderIcon
									classes="animate-spin-slow"
									icon={Icons.Interface.Loading}
								/>
							)}
							<Button
								disabled={isFetching}
								style="secondary"
								text={t("cancel")}
								onClick={() => {
									setOpenModal();
									setCurrentValue(tempValue);
								}}
							/>
							<Button
								disabled={isFetching}
								text={t("update")}
								type="submit"
							/>
						</div>
					</fetcher.Form>
				</Modal>
			)}
		</>
	);
};
