import { useContext, useEffect, SetStateAction, Dispatch } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { FORM_IDENTIFIERS } from "../../../constants.common/formIdentifiers";
import { NotificationContext } from "../../../context.common/NotificationContext";
import { useFetcher } from "../../../hooks.common/useFetcher";
import ResponseDataUtilities from "../../../utilities.common/ResponseDataUtilities";
import { QuestionsContext } from "../../process.questions/partials/_QuestionsContext";
import { Link } from "react-router-dom";

type PartialSaveProps = {
	opID?: number | undefined;
	changeKey?: Dispatch<SetStateAction<number>>;
	conKey?: number;
};

export const PartialSave = ({ opID, changeKey, conKey }: PartialSaveProps) => {
	const {
		previewMode,
		generalQuestionsState,
		machiningStitchingQuestionsState,
		machiningPalletStitchingQuestionsState,
		machiningStrobelStitchingQuestionsState,
		machiningFoldingQuestionsState,
		cuttingQuestionsState,
		knivesQuestionsState,
		additionalStepsQuestionsState,
		unmannedQuestionsState,
		groupProcessesQuestionsState,
		pathsQuestionsState,
		questionsAnswers,
		isSaving,
		setIsSaving,
		updateMap,
		isUMapUpdated,
	} = useContext(QuestionsContext);
	const { fetcher, isFetching, responseData } = useFetcher();
	const { processResponse } = useContext(NotificationContext);
	const { t } = useTranslation();

	useEffect(() => {
		if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData?.type, responseData, processResponse]);

	useEffect(() => {
		if (!previewMode) {
			setIsSaving(isFetching);
		}
	}, [isFetching, previewMode, setIsSaving]);

	return (
		<fetcher.Form method="put" action="questions">
			<input
				type="hidden"
				name={FORM_IDENTIFIERS.nameAttribute}
				value={FORM_IDENTIFIERS.partialSaveProcessQuestions}
			/>
			<input
				type="hidden"
				value={JSON.stringify(generalQuestionsState)}
				name="generalQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(machiningStitchingQuestionsState)}
				name="machiningStitchingQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(machiningPalletStitchingQuestionsState)}
				name="machiningPalletStitchingQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(machiningStrobelStitchingQuestionsState)}
				name="machiningStrobelStitchingQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(machiningFoldingQuestionsState)}
				name="machiningFoldingQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(cuttingQuestionsState)}
				name="cuttingQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(knivesQuestionsState)}
				name="knivesQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(additionalStepsQuestionsState)}
				name="additionalStepsQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(unmannedQuestionsState)}
				name="unmannedQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(groupProcessesQuestionsState)}
				name="groupOperationsQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(pathsQuestionsState)}
				name="pathsQuestionsState"
			/>
			<input
				type="hidden"
				value={JSON.stringify(questionsAnswers)}
				name="questionsAnswers"
			/>
			<input
				type="hidden"
				value={JSON.stringify(updateMap)}
				name="updateMap"
			/>
			<Button
				disabled={isSaving || !isUMapUpdated(updateMap ?? {})}
				text={t("save&Exit", { defaultValue: "Save & Exit" })}
				style="secondary"
				type="submit"
				className="mr-4"
			/>
			<Link
				to={`/processes/${opID}`}
				className="button button--primary inline-block"
				onClick={() => {
					if (changeKey && conKey) {
						changeKey(conKey + 1);
					}
				}}
			>
				{t("cancel", { defaultValue: "Cancel" })}
			</Link>
		</fetcher.Form>
	);
};
