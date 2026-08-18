import { UniqueIdentifier } from "@dnd-kit/core";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import {
	StepData,
	StepMainActionData,
	ActionData,
} from "../api.common/types";
import { stepQuery } from "../queries.common/stepQuery";

export type StepHandActionData = {
	id: UniqueIdentifier;
	draggableId: UniqueIdentifier;
	droppableId: UniqueIdentifier;
	ActionID?: number | null;
	Action?: ActionData | null;
	Comment?: string | null;
	Quantity?: number | null;
	Time_Seconds?: number | null;
	Time_Minutes?: number | null;
	isCounted: boolean;
	hand?: "left" | "right";
};

export type StepLinkActionData = StepMainActionData & {
	collapsed: boolean;
};

export const useStep = () => {
	const params = useParams();
	const query = useQuery(stepQuery(params.id as string));
	const data = query.data as AxiosResponse<StepData>;
	const step = data?.data;
	const actions = step?.Actions;

	// TODO: Could/should these be cached?
	const linkActions: StepLinkActionData[] = [];
	const leftHandActions: StepHandActionData[] = [];
	const rightHandActions: StepHandActionData[] = [];

	let linkedIndex = -1;

	actions?.forEach((action, index) => {
		if (!action.SimoLinkPrev) {
			linkedIndex++;
		}

		const {
			LHComment,
			LHQuantity,
			LHTime_Minutes,
			LHTime_Seconds,
			LHActionID,
			_LHAction,
			RHComment,
			RHQuantity,
			RHTime_Minutes,
			RHTime_Seconds,
			RHActionID,
			_RHAction,
		} = action;

		linkActions.push({
			collapsed: false,
			ID: action.ID,
			Seq: action.Seq,
			SimoLinkPrev: action.SimoLinkPrev,
		});

		leftHandActions.push({
			id: LHActionID
				? `left-${LHActionID}-${index}`
				: `left-empty-${index}`,
			draggableId: LHActionID
				? `draggable-left-${LHActionID}-${index}`
				: `draggable-left-empty-${index}`,
			droppableId: LHActionID
				? `droppable-left-${LHActionID}-${index}`
				: `droppable-left-empty-${index}`,
			Comment: LHComment,
			Quantity: LHQuantity,
			Time_Minutes: LHTime_Minutes,
			Time_Seconds: LHTime_Seconds,
			ActionID: LHActionID,
			Action: _LHAction,
			isCounted: step.DominantLeftHand?.[linkedIndex] === true,
		});

		rightHandActions.push({
			id: RHActionID
				? `right-${RHActionID}-${index}`
				: `right-empty-${index}`,
			draggableId: RHActionID
				? `draggable-right-${RHActionID}-${index}`
				: `draggable-right-empty-${index}`,
			droppableId: RHActionID
				? `droppable-right-${RHActionID}-${index}`
				: `droppable-right-empty-${index}`,
			Comment: RHComment,
			Quantity: RHQuantity,
			Time_Minutes: RHTime_Minutes,
			Time_Seconds: RHTime_Seconds,
			ActionID: RHActionID,
			Action: _RHAction,
			isCounted: step.DominantLeftHand?.[linkedIndex] === false,
		});
	});

	return { step, linkActions, leftHandActions, rightHandActions };
};
