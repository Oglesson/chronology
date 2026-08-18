import { QueryClient } from "@tanstack/query-core";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { updateMachiningAmendmentAction } from "../machining.amendments/Actions";
import {
	createMachineAction,
	deleteMachineAction,
	updateMachineAction,
} from "../machining.machines/Actions";
import { updateStitchingFoldingAction } from "../machining.stitching/Actions";
import { updateStitchingCharacteristicsAction } from "../machining.stitching-characteristics/Actions";
import {
	createStitchingModifierAction,
	deleteStitchingModifierAction,
	updateStitchingModifierAction,
} from "../machining.stitching-modifiers/Actions";

export const machiningAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const formData = await request.formData();
		const { identifier } = Object.fromEntries(formData.entries());

		switch (identifier) {
			case FORM_IDENTIFIERS.createMachine:
				return await createMachineAction(queryClient, formData);
			case FORM_IDENTIFIERS.deleteMachine:
				return await deleteMachineAction(queryClient, formData);
			case FORM_IDENTIFIERS.updateMachine:
				return await updateMachineAction(queryClient, formData);
			case FORM_IDENTIFIERS.updateMachiningAmendment:
				return await updateMachiningAmendmentAction(
					queryClient,
					formData
				);
			case FORM_IDENTIFIERS.createStitchingModifier:
				return await createStitchingModifierAction(
					queryClient,
					formData
				);
			case FORM_IDENTIFIERS.deleteStitchingModifier:
				return await deleteStitchingModifierAction(
					queryClient,
					formData
				);
			case FORM_IDENTIFIERS.updateStitchingModifier:
				return await updateStitchingModifierAction(
					queryClient,
					formData
				);
			case FORM_IDENTIFIERS.updateStitchingCharacteristics:
				return await updateStitchingCharacteristicsAction(
					queryClient,
					formData
				);
			case FORM_IDENTIFIERS.updateStitchingFolding:
				return await updateStitchingFoldingAction(
					queryClient,
					formData
				);
			default:
				return null;
		}
	};
