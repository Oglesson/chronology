import { useContext, useEffect } from "react";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { AddKnife } from "./_AddKnife";
import { FormFooter } from "./_FormFooter";
import { KnivesList } from "./_KnivesList";
import { QuestionsContext } from "./_QuestionsContext";

export const KnivesQuestions = () => {
	const {
		previewMode,
		setGroupSubmit,
		setKnivesQuestionsState,
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
			<KnivesList />
			<div className="mt-7">
				<AddKnife />
			</div>
			<fetcher.Form
				onSubmit={(_e) => {
					setKnivesQuestionsState((previous) => {
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
