import { DefaultTReturn, TOptions } from "i18next";
import Lottie from "lottie-react";
import { ReactElement, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../common/button/Button";
import Icons from "../../config.common/Icons";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import animation from "../../data.lottie/delete.json";
import { useFetcher } from "../../hooks.common/useFetcher";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";
import { Modal } from "./Modal";
import { NotificationContext } from "../../context.common/NotificationContext";

interface DeleteItemModalProps {
	body?: string | DefaultTReturn<TOptions>;
	deletionId: number | undefined;
	parentId?: number | undefined;
	heading: string | ReactElement;
	identifier?: string;
	isOpen: boolean;
	toggleState: () => void;
}

export const DeleteItemModal = ({
	body,
	deletionId,
	parentId,
	heading,
	identifier,
	isOpen,
	toggleState,
	...props
}: DeleteItemModalProps) => {
	const { t } = useTranslation();
	const { fetcher, isFetching, responseData } = useFetcher();
	const { processResponse } = useContext(NotificationContext);

	useEffect(() => {
		if (responseData?.type === "success") {
			ResponseDataUtilities.resetResponseData(responseData);
			toggleState();
		} else if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData?.type]);

	return (
		<Modal isOpen={isOpen} {...props}>
			<Lottie
				className="w-23 h-23 mb-8 rounded-full bg-black"
				animationData={animation}
				loop={false}
			/>
			<div className="max-w-[21rem]">
				<h3 className="typo-h3">{heading}</h3>
				{body && <p className="mt-5">{body}</p>}
			</div>

			<fetcher.Form action="" method="delete">
				<input type="hidden" name="id" value={deletionId} />
				{parentId && (
					<input type="hidden" name="parentId" value={parentId} />
				)}
				{identifier && (
					<input
						type="hidden"
						name={FORM_IDENTIFIERS.nameAttribute}
						value={identifier}
					/>
				)}

				<div className="flex justify-end items-center mt-16 gap-6">
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
						onClick={toggleState}
					/>
					<Button
						disabled={isFetching}
						text={t("delete")}
						theme="decline"
						type="submit"
					/>
				</div>
			</fetcher.Form>
		</Modal>
	);
};
