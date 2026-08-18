import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "../../api.common";
import {
	ProcessDefinitionsDefaultCuttingData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const updateCuttingAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }): Promise<ResponseData> => {
		const formData = await request.formData();
		const cache = queryClient
			.getQueryCache()
			.find(
				QUERY_KEYS.settings_cutting_process_definitions_default_cutting
			);

		const { data: cachedSettings } = cache?.state
			.data as AxiosResponse<ProcessDefinitionsDefaultCuttingData>;

		const settings = ObjectUtilities.deepCopy(cachedSettings);

		delete settings._Cuttingmethodnatural;
		delete settings._Cuttingmethodsynthetic;
		delete settings._Cuttingtype;
		delete settings._Feedsystem;
		delete settings._Materialtype;
		delete settings._Units;

		const clonedSettings = ObjectUtilities.deepCopy(settings);

		hydrate(clonedSettings, formData);

		if (ObjectUtilities.areEqual(settings, clonedSettings)) {
			return {
				type: "success",
			};
		}

		let errorData: ResponseData | undefined;

		const response = await api
			.updateProcessDefinitionsDefaultCutting(clonedSettings)
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
			QUERY_KEYS.settings_cutting_process_definitions_default_cutting
		);

		return {
			code: (response as AxiosResponse).status,
			message: (response as AxiosResponse).statusText,
			type: "success",
		};
	};

const hydrate = (
	clonedSettings: ProcessDefinitionsDefaultCuttingData,
	formData: FormData
) => {
	const {
		materialType,
		cuttingType,
		units,
		unitsPerJob,
		sizes,
		cuttingMethodNatural,
		cuttingMethodSynthetic,
		feedSystem,
		layers,
		width,
		fabricLength,
		depth,
		area,
		coefficient,
	} = Object.fromEntries(formData.entries());

	if (materialType) {
		clonedSettings.MaterialtypeID = Number(materialType);
	}

	if (cuttingType) {
		clonedSettings.CuttingtypeID = Number(cuttingType);
	}

	if (units) {
		clonedSettings.UnitsID = Number(units);
	}

	if (unitsPerJob) {
		clonedSettings.UnitsPerJob = Number(unitsPerJob);
	}

	if (sizes) {
		clonedSettings.Sizes = Number(sizes);
	}

	if (cuttingMethodNatural) {
		clonedSettings.CuttingmethodnaturalID = Number(cuttingMethodNatural);
	}

	if (cuttingMethodSynthetic) {
		clonedSettings.CuttingmethodsyntheticID = Number(
			cuttingMethodSynthetic
		);
	}

	if (feedSystem) {
		clonedSettings.FeedsystemID = Number(feedSystem);
	}

	if (layers) {
		clonedSettings.Layers = Number(layers);
	}

	if (width) {
		clonedSettings.Width = Number(width);
	}

	if (fabricLength) {
		clonedSettings.Length = Number(fabricLength);
	}

	if (depth) {
		clonedSettings.Depth = Number(depth);
	}

	if (area) {
		clonedSettings.Area = Number(area);
	}

	if (coefficient) {
		clonedSettings.Coefficient = Number(coefficient);
	}
};
