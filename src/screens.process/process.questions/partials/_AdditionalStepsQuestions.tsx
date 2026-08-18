import { useContext, useEffect } from "react";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { AddAdditionalStep } from "./_AddAdditionalStep";
import { AdditionalStepsList } from "./_AdditionalStepsList";
import { FormFooter } from "./_FormFooter";
import { QuestionsContext } from "./_QuestionsContext";

export const AdditionalStepsQuestions = () => {
	const {
		previewMode,
		setGroupSubmit,
		setAdditionalStepsQuestionsState,
		setIsSaving,
	} = useContext(QuestionsContext);

	const { fetcher, isFetching } = useFetcher();

	useEffect(() => {
		if (!previewMode) {
			setIsSaving(isFetching);
		}
	}, [isFetching, previewMode, setIsSaving]);

	return (
		<>
			<AdditionalStepsList />
			<div className="mt-7">
				<AddAdditionalStep />
			</div>
			<fetcher.Form
				onSubmit={(_e) => {
					setAdditionalStepsQuestionsState((previous) => {
						const next = { ...previous };
						next.answered = true;
						return next;
					});

					setGroupSubmit(true);
				}}
			>
				<FormFooter />
			</fetcher.Form>
		</>
	);
};
