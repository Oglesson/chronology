import { DefaultTReturn, TOptions } from "i18next";
import Lottie from "lottie-react";
import { ReactElement, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../common/button/Button";
import Icons from "../../config.common/Icons";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import animation from "../../data.lottie/save.json";
import { useFetcher } from "../../hooks.common/useFetcher";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";
import { Modal } from "./Modal";
import { NotificationContext } from "../../context.common/NotificationContext";

interface CopyItemModalProps {
	body?: string | DefaultTReturn<TOptions>;
	copyId: number | undefined;
	parentId?: number | undefined;
	heading: string | ReactElement;
	identifier?: string;
	isOpen: boolean;
	toggleState: () => void;
}

export const CopyItemModal = ({
	body,
	copyId,
	parentId,
	heading,
	identifier,
	isOpen,
	toggleState,
	...props
}: CopyItemModalProps) => {
	const { t } = useTranslation();
	const { fetcher, isFetching, responseData } = useFetcher();
	const { processResponse } = useContext(NotificationContext);

	const nameOfCopy = (name: string) => {
		// eslint-disable-next-line react-hooks/purity
		const rand = Math.round(Math.random() * 1000);
		if (name.length > 16) {
			return `${name.slice(0, 16)}_${rand}`;
		} else {
			return `${name}_${rand}`;
		}
	};

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

			<fetcher.Form action="" method="post">
				<input type="hidden" name="id" value={copyId} />
				{parentId && (
					<input type="hidden" name="parentId" value={parentId} />
				)}
				{identifier && (
					<input
						type="hidden"
						name={FORM_IDENTIFIERS.nameAttribute}
						value={nameOfCopy(identifier)}
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
						text={t("copy")}
						type="submit"
					/>
				</div>
			</fetcher.Form>
		</Modal>
	);
};
