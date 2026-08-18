import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "../../api.common";
import {
	ProcessDefinitionsMachiningData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const updateStitchingFoldingAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find(QUERY_KEYS.settings_machining_process_definitions_machining);

	const { data: cachedSettings } = cache?.state
		.data as AxiosResponse<ProcessDefinitionsMachiningData>;

	const settings = ObjectUtilities.deepCopy(cachedSettings);

	delete settings._Stitchingmodifier;

	const clonedSettings = ObjectUtilities.deepCopy(settings);

	hydrate(clonedSettings, formData);

	if (ObjectUtilities.areEqual(settings, clonedSettings)) {
		return {
			type: "success",
		};
	}

	let errorData: ResponseData | undefined;

	const response = await api
		.updateProcessDefinitionsMachining(clonedSettings)
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
		QUERY_KEYS.settings_machining_process_definitions_machining
	);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (
	clonedSettings: ProcessDefinitionsMachiningData,
	formData: FormData
) => {
	const {
		maximumSpeed_Min,
		maximumSpeed_Max,
		maximumSpeed_Default,
		minimumSpeed_Min,
		minimumSpeed_Max,
		minimumSpeed_Default,
		density_Min,
		density_Max,
		density_Default,
		density_dps,
		materialProperty,
		machineType,
		needleType,
		type,
		pallet_ProgrammedSpeed_Min,
		pallet_ProgrammedSpeed_Max,
		pallet_ProgrammedSpeed_Default,
		pallet_Density_Min,
		pallet_Density_Max,
		pallet_Density_Default,
		pallet_Density_dps,
	} = Object.fromEntries(formData.entries());

	if (maximumSpeed_Min) {
		clonedSettings.MaximumSpeed_Min = Number(maximumSpeed_Min);
	}

	if (maximumSpeed_Max) {
		clonedSettings.MaximumSpeed_Max = Number(maximumSpeed_Max);
	}

	if (maximumSpeed_Default) {
		clonedSettings.MaximumSpeed_Default = Number(maximumSpeed_Default);
	}

	if (minimumSpeed_Min) {
		clonedSettings.MinimumSpeed_Min = Number(minimumSpeed_Min);
	}

	if (minimumSpeed_Max) {
		clonedSettings.MinimumSpeed_Max = Number(minimumSpeed_Max);
	}

	if (minimumSpeed_Default) {
		clonedSettings.MinimumSpeed_Default = Number(minimumSpeed_Default);
	}

	if (density_Min) {
		clonedSettings.Density_Min = Number(density_Min);
	}

	if (density_Max) {
		clonedSettings.Density_Max = Number(density_Max);
	}

	if (density_Default) {
		clonedSettings.Density_Default = Number(density_Default);
	}

	if (density_dps) {
		clonedSettings.Density_dps = Number(density_dps);
	}

	if (materialProperty) {
		clonedSettings.MaterialPropertyFloppy = materialProperty === "yes";
	}

	if (machineType) {
		clonedSettings.MachineTypePost = machineType === "yes";
	}

	if (needleType) {
		clonedSettings.NeedleTypeTwin = needleType === "yes";
	}

	if (type) {
		clonedSettings.StitchingmodifierID = Number(type);
	}

	if (pallet_ProgrammedSpeed_Min) {
		clonedSettings.Pallet_ProgrammedSpeed_Min = Number(
			pallet_ProgrammedSpeed_Min
		);
	}

	if (pallet_ProgrammedSpeed_Max) {
		clonedSettings.Pallet_ProgrammedSpeed_Max = Number(
			pallet_ProgrammedSpeed_Max
		);
	}

	if (pallet_ProgrammedSpeed_Default) {
		clonedSettings.Pallet_ProgrammedSpeed_Default = Number(
			pallet_ProgrammedSpeed_Default
		);
	}

	if (pallet_Density_Min) {
		clonedSettings.Pallet_Density_Min = Number(pallet_Density_Min);
	}

	if (pallet_Density_Max) {
		clonedSettings.Pallet_Density_Max = Number(pallet_Density_Max);
	}

	if (pallet_Density_Default) {
		clonedSettings.Pallet_Density_Default = Number(pallet_Density_Default);
	}

	if (pallet_Density_dps) {
		clonedSettings.Pallet_Density_dps = Number(pallet_Density_dps);
	}
};
