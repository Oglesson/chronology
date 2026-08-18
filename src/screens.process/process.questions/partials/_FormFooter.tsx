import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { useQuestionsContext } from "../../../hooks.queries/useQuestionsContext";
import { SaveIndicator } from "../../process.index/partials/_SaveIndicator";
import { QuestionsContext } from "./_QuestionsContext";

export const FormFooter = () => {
	const { t } = useTranslation();
	const { previewMode, activeGroupId, setActiveGroupId, groups, isSaving } =
		useQuestionsContext();
	const { formHasChanged } = useContext(QuestionsContext);
	const currentGroupIndex = groups.findIndex((c) => c.id === activeGroupId);
	const isFirstQuestion = currentGroupIndex === 0;
	const isLastQuestion = currentGroupIndex === groups.length - 1;

	return (
		<div
			className={
				"fixed z-20 bottom-0 overflow-hidden p-6.5 flex justify-end pointer-events-none " +
				(previewMode
					? "right-0"
					: "left-0 w-screen max-w-full [scrollbar-gutter:stable]")
			}
		>
			<div className="flex items-center gap-6 pointer-events-auto">
				<SaveIndicator />
				{!isFirstQuestion && (
					<button
						className="inline-block px-5 py-4 text-button text-black dark:text-white font-medium underline underline-offset-4 backdrop-blur-md rounded-full hover:text-opacity-70 disabled:text-opacity-30"
						disabled={isSaving}
						type="button"
						onClick={() => {
							setActiveGroupId(groups[currentGroupIndex - 1].id);
						}}
					>
						{t("previous")}
					</button>
				)}

				{!isLastQuestion && (
					<button
						className="inline-block px-5 py-4 text-button text-black dark:text-white font-medium underline underline-offset-4 backdrop-blur-md rounded-full hover:text-opacity-70 disabled:text-opacity-30"
						disabled={isSaving}
						type="submit"
					>
						{t("next")}
					</button>
				)}
				{isLastQuestion && (
					<Button
						onClick={() => formHasChanged("Header")}
						disabled={isSaving}
						type="submit"
						text={
							previewMode
								? t("testAnswers", {
										defaultValue: "Test Answers",
								  })
								: t("completeProcess")
						}
					/>
				)}
			</div>
		</div>
	);
};
