import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Icons from "../../../config.common/Icons";
import { QuestionState } from "../../../hooks.queries/useProcessQuestions";
import { useQuestionsContext } from "../../../hooks.queries/useQuestionsContext";
import { RenderIcon } from "../../../utilities.common/RenderIcon";

export const QuestionGroupsMenu = () => {
	const {
		previewMode,
		activeGroupId,
		setActiveGroupId,
		groups,
		percentageComplete,
	} = useQuestionsContext();

	const { t } = useTranslation();

	const renderStateIcon = (state: QuestionState) => {
		switch (state) {
			case "complete":
				return (
					<RenderIcon
						classes="text-green"
						icon={Icons.Interface.Check}
					/>
				);
			case "incomplete":
				return (
					<RenderIcon
						classes="text-in-progress"
						icon={Icons.Interface.Warning}
					/>
				);
			case "error":
				return (
					<RenderIcon
						classes="text-decline"
						icon={Icons.Interface.Warning}
					/>
				);
		}
		return;
	};

	return (
		<div
			className={
				"px-8 pt-8 pb-20 rounded-md " +
				(previewMode
					? "bg-grey-lightest dark:bg-black-subtle"
					: "bg-grey-lightest dark:bg-black-subtle")
			}
		>
			<p className="typo-pre-heading text-grey-light">
				<>
					{percentageComplete}% {t("complete")}
				</>
			</p>
			<h4 className="typo-h4 mt-1.5">
				{t("buildYourProcess", {
					defaultValue: "Build your Process",
				})}
			</h4>
			<ul className="mt-16">
				{groups &&
					groups.length > 0 &&
					groups?.map((group, index) => {
						return (
							<li
								key={group.id}
								className={classNames(
									"",
									index > 0 && "border-t border-t-black"
								)}
							>
								<button
									className={classNames(
										"flex items-center justify-between w-full py-2.75 text-left transition-colors duration-100",
										activeGroupId === group.id
											? "text-green"
											: "hover:text-grey-light",
										group.needsClass ? group.needsClass : ""
									)}
									type="button"
									onClick={() => {
										setActiveGroupId(group.id);
									}}
								>
									{group.description}
									<div className="flex-none ml-5 w-6 h-6">
										{renderStateIcon(group.state)}
									</div>
								</button>
							</li>
						);
					})}
			</ul>
		</div>
	);
};
