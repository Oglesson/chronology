import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "../../api.common";
import {
	ResponseData,
	ResponseMessage,
	StitchingCharacteristicsData,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const updateStitchingCharacteristicsAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find(QUERY_KEYS.settings_machining_stitching_characteristics);

	const { data: cachedSettings } = cache?.state
		.data as AxiosResponse<StitchingCharacteristicsData>;

	const settings = ObjectUtilities.deepCopy(cachedSettings);
	const clonedSettings = ObjectUtilities.deepCopy(settings);

	hydrate(clonedSettings, formData);

	if (ObjectUtilities.areEqual(settings, clonedSettings)) {
		return {
			type: "success",
		};
	}

	let errorData: ResponseData | undefined;
	const response = await api
		.updateStitchingCharacteristics(clonedSettings)
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
		QUERY_KEYS.settings_machining_stitching_characteristics
	);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (
	clonedSettings: StitchingCharacteristicsData,
	formData: FormData
) => {
	const { materialPropertyFloppy, machineTypePost, needleTypeTwin } =
		Object.fromEntries(formData.entries());

	if (materialPropertyFloppy) {
		clonedSettings.MaterialPropertyFloppy = Number(materialPropertyFloppy);
	}

	if (machineTypePost) {
		clonedSettings.MachineTypePost = Number(machineTypePost);
	}

	if (needleTypeTwin) {
		clonedSettings.NeedleTypeTwin = Number(needleTypeTwin);
	}
};
