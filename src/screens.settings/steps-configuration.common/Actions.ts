import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "../../api.common";
import {
	CuttingStepSettingData,
	MachiningStepSettingData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const configurationAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const formData = await request.formData();
		const { machiningFeedRate } = Object.fromEntries(formData.entries());

		if (machiningFeedRate) {
			return await updateMachiningStepSettingAction(
				queryClient,
				formData
			);
		}

		return await updateCuttingStepSettingAction(queryClient, formData);
	};

const updateCuttingStepSettingAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find(QUERY_KEYS.settings_cutting_steps);

	const { data: cachedCuttingStepSetting } = cache?.state
		.data as AxiosResponse<CuttingStepSettingData[]>;

	const matchingCuttingStepSetting = cachedCuttingStepSetting.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingCuttingStepSetting) {
		return {
			message: "Cutting Step Setting doesn't exist",
			type: "error",
		};
	}

	const cuttingStepSetting = ObjectUtilities.deepCopy(
		matchingCuttingStepSetting
	);
	const clonedCuttingStepSetting = ObjectUtilities.deepCopy(
		cuttingStepSetting
	);

	hydrateCuttingStepSetting(clonedCuttingStepSetting, formData);

	if (
		ObjectUtilities.areEqual(
			cuttingStepSetting,
			clonedCuttingStepSetting
		)
	)
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;
	const response = await api
		.updateCuttingStepSetting(clonedCuttingStepSetting)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(QUERY_KEYS.settings_cutting_steps);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrateCuttingStepSetting = (
	clonedMachiningStepSetting: CuttingStepSettingData,
	formData: FormData
) => {
	const { inUse } = Object.fromEntries(formData.entries());

	if (inUse) {
		clonedMachiningStepSetting.InUse = inUse === "yes";
	}
};

const updateMachiningStepSettingAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find(QUERY_KEYS.settings_machining_steps);

	const { data: cachedMachiningStepSetting } = cache?.state
		.data as AxiosResponse<MachiningStepSettingData[]>;

	const matchingMachiningStepSetting = cachedMachiningStepSetting.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingMachiningStepSetting) {
		return {
			message: "Machining Step Setting doesn't exist",
			type: "error",
		};
	}

	const machiningStepSetting = ObjectUtilities.deepCopy(
		matchingMachiningStepSetting
	);
	const clonedMachiningStepSetting = ObjectUtilities.deepCopy(
		machiningStepSetting
	);

	hydrateMachiningStepSetting(clonedMachiningStepSetting, formData);

	if (
		ObjectUtilities.areEqual(
			machiningStepSetting,
			clonedMachiningStepSetting
		)
	)
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;
	const response = await api
		.updateMachiningStepSetting(clonedMachiningStepSetting)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(QUERY_KEYS.settings_machining_steps);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrateMachiningStepSetting = (
	clonedMachiningStepSetting: MachiningStepSettingData,
	formData: FormData
) => {
	const { machiningFeedRate } = Object.fromEntries(formData.entries());

	if (machiningFeedRate) {
		clonedMachiningStepSetting.MachiningFeedRate =
			Number(machiningFeedRate);
	}
};
