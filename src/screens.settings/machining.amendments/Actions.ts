import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "../../api.common";
import {
	MachiningAmendmentData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const updateMachiningAmendmentAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find(QUERY_KEYS.settings_machining_amendments);

	const { data: cachedMachiningAmendments } = cache?.state
		.data as AxiosResponse<MachiningAmendmentData[]>;

	const matchingMachiningAmendment = cachedMachiningAmendments.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingMachiningAmendment) {
		return {
			message: "Machining Amendment doesn't exist",
			type: "error",
		};
	}

	const machiningAmendment = ObjectUtilities.deepCopy(
		matchingMachiningAmendment
	);
	const clonedMachiningAmendment =
		ObjectUtilities.deepCopy(machiningAmendment);

	hydrate(clonedMachiningAmendment, formData);

	if (ObjectUtilities.areEqual(machiningAmendment, clonedMachiningAmendment))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;
	const response = await api
		.updateMachiningAmendment(clonedMachiningAmendment)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(
		QUERY_KEYS.settings_machining_amendments
	);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (
	clonedMachiningAmendment: MachiningAmendmentData,
	formData: FormData
) => {
	const { speedRatio, distance } = Object.fromEntries(formData.entries());

	if (speedRatio) {
		clonedMachiningAmendment.SpeedRatio = Number(speedRatio);
	}

	if (distance) {
		clonedMachiningAmendment.Distance = Number(distance);
	}
};
