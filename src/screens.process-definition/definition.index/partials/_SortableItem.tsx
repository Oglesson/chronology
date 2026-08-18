import { UniqueIdentifier, useDndContext } from "@dnd-kit/core";
import {
	AnimateLayoutChanges,
	defaultAnimateLayoutChanges,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProcessDefinitionQuestionData } from "../../../api.common/types";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import { Label } from "../../../forms.common/Label";
import { EditQuestion } from "./_EditQuestion";
import { RemoveQuestion } from "./_RemoveQuestion";

type SortableItemProps = {
	disabled?: boolean;
	id: UniqueIdentifier;
	questionData?: ProcessDefinitionQuestionData;
};

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
	defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export const SortableItem = ({
	disabled,
	id,
	questionData,
	...props
}: SortableItemProps) => {
	const { active } = useDndContext();
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: id, animateLayoutChanges });

	const { t } = useTranslation();

	const [hasHighlight, setHasHighlight] = useState(false);

	if (!questionData) {
		return <></>;
	}

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const renderActions = () =>
		!disabled && (
			<ItemActionsMenu
				className={classNames(
					"ml-auto",
					hasHighlight && "opacity-100",
					!hasHighlight && "opacity-0 group-hover:opacity-100",
				)}
				onKeyDown={(event) => {
					event.stopPropagation();
				}}
				onPointerDown={(event) => {
					event.stopPropagation();
				}}
				actions={[
					{
						step: <EditQuestion data={questionData} />,
					},
					{
						step: <RemoveQuestion data={questionData} />,
					},
				]}
				buttonLabel={t("moreActions")}
				open={active ? false : undefined}
				toggle={(isOpen) => {
					setHasHighlight(isOpen);
				}}
			/>
		);

	const renderQuestion = (question: ProcessDefinitionQuestionData) => {
		if (question.QuestionsNumbers) {
			return (
				<div className="flex gap-x-2 items-center">
					<label className="w-56 flex-none text-grey-light">
						{question.Description}
					</label>
					<input
						className="form-input pointer-events-none"
						value={question.QuestionsNumbers.DefaultValue.toFixed(
							question.QuestionsNumbers.Dps,
						)}
						disabled
					/>
					{renderActions()}
				</div>
			);
		}

		if (question.QuestionsChoices) {
			return (
				<div>
					<div className="flex items-center mb-6">
						<p className=" text-grey-light">
							{question.Description}
						</p>
						{renderActions()}
					</div>
					<div className="space-y-3.5">
						{question.QuestionsChoices.map((choice, index) => (
							<div
								key={choice.ChoiceIndex}
								className="flex items-center"
							>
								<input
									className="form-radio pointer-events-none"
									type="radio"
									value={choice.ChoiceValue}
									checked={
										index === question.DefaultIndexIfChoice
									}
									disabled
								/>
								<Label
									label={choice.ChoiceValue}
									theme="checkable"
								/>
							</div>
						))}
					</div>
				</div>
			);
		}

		return <></>;
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			{...props}
			className={classNames(
				"rounded-md py-3 pl-3 pr-2 group",
				disabled && "cursor-default",
				hasHighlight && !disabled && "bg-grey-lighter dark:bg-black",
				!hasHighlight &&
					!disabled &&
					"hover:bg-grey-lighter dark:hover:bg-black",
				isDragging && "opacity-30",
			)}
		>
			{renderQuestion(questionData)}
		</div>
	);
};
