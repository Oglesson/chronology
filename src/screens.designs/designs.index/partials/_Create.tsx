import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../../components/common/button/Button";
import Icons from "../../../config.common/Icons";
import { FileInput } from "../../../forms.common/FileInput";
import { Input } from "../../../forms.common/Input";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useDesignFormSchema } from "../../../hooks.schema/forms";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { useDesigns } from "../../../hooks.queries/useDesigns";
import ResponseDataUtilities from "../../../utilities.common/ResponseDataUtilities";
import { NotificationContext } from "../../../context.common/NotificationContext";

type CreateProps = {
	action?: string;
	closeAction: () => void;
};

type GetDesignCodesProps = {
	setDesignCodes: Dispatch<SetStateAction<string[]>>;
};

const GetDesignCodes = ({ setDesignCodes }: GetDesignCodesProps) => {
	const { designCodes } = useDesigns();
	const designCodesSerialized = JSON.stringify(designCodes);
	useEffect(() => {
		setDesignCodes(designCodes);
	}, [designCodesSerialized, setDesignCodes]); // eslint-disable-line react-hooks/exhaustive-deps
	return <></>;
};

export const Create = ({ action, closeAction }: CreateProps) => {
	const [designCodes, setDesignCodes] = useState<string[]>([]);
	const designFormSchema = useDesignFormSchema(designCodes);
	type DesignFormData = z.infer<typeof designFormSchema>;

	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(designFormSchema),
	});
	const onSubmit = (data: DesignFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const { processResponse } = useContext(NotificationContext);

	const { fetcher, isFetching, responseData } = useFetcher();

	useEffect(() => {
		if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData, processResponse]);

	return (
		<>
			<GetDesignCodes setDesignCodes={setDesignCodes} />
			<h2 className="typo-h3 mb-12">
				{t("createADesign", {
					defaultValue: "Create a Design",
				})}
			</h2>
			<fetcher.Form
				method="post"
				action={action ?? ""}
				onSubmit={(e) => {
					if (!isValid) {
						handleSubmit(onSubmit, onSubmitError)(e);

						return;
					}
				}}
				encType="multipart/form-data"
			>
				<Input
					error={errors.code}
					htmlFor={"code"}
					label={t("code")}
					name="code"
					placeholder="Enter a code..."
					register={register}
				/>
				<Input
					error={errors.description}
					htmlFor={"description"}
					label={t("description")}
					name="description"
					placeholder="Enter a description..."
					register={register}
				/>
				<Input
					error={errors.pairsCosted}
					htmlFor={"pairsCosted"}
					label={t("pairsCosted")}
					name="pairsCosted"
					placeholder="Enter a value..."
					type="number"
					register={register}
				/>
				<FileInput
					accept="image/jpeg, image/jpg, image/bmp, image/gif, image/png"
					error={errors.photo}
					htmlFor={"photo"}
					icon={Icons.Interface.Media}
					label={t("photo")}
					name="photo"
					placeholder="Drop file here or click to upload"
					register={register}
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
						onClick={() => closeAction()}
					/>
					<Button
						disabled={isFetching}
						text={t("create")}
						type="submit"
					/>
				</div>
			</fetcher.Form>
		</>
	);
};
