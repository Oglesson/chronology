import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "../../api.common";
import {
	ResponseData,
	ResponseMessage,
	StitchingModifierData,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const createStitchingModifierAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const response = await api
		.createStitchingModifier({
			No: Number(formData.get("no")),
			Description: formData.get("description") as string,
			EffectLevel: Number(formData.get("effectLevel")),
			Modifier: Number(formData.get("modifier")),
		})
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
		QUERY_KEYS.settings_machining_stitching_modifiers
	);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

export const deleteStitchingModifierAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	await api
		.deleteStitchingModifier(Number(formData.get("id")))
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
		QUERY_KEYS.settings_machining_stitching_modifiers
	);

	return null;
};

export const updateStitchingModifierAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find(QUERY_KEYS.settings_machining_stitching_modifiers);

	const { data: cachedStitchingModifiers } = cache?.state
		.data as AxiosResponse<StitchingModifierData[]>;

	const matchingStitchingModifier = cachedStitchingModifiers.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingStitchingModifier) {
		return {
			message: "Stitching Modifier doesn't exist",
			type: "error",
		};
	}

	const stitchingModifier = ObjectUtilities.deepCopy(
		matchingStitchingModifier
	);

	const clonedStitchingModifier = ObjectUtilities.deepCopy(stitchingModifier);

	hydrate(clonedStitchingModifier, formData);

	if (ObjectUtilities.areEqual(stitchingModifier, clonedStitchingModifier))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;

	const response = await api
		.updateStitchingModifier(clonedStitchingModifier)
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
		QUERY_KEYS.settings_machining_stitching_modifiers
	);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (
	clonedStitchingModifier: StitchingModifierData,
	formData: FormData
) => {
	const { no, description, modifier, effectLevel } = Object.fromEntries(
		formData.entries()
	);

	if (no) {
		clonedStitchingModifier.No = Number(no);
	}

	if (description !== undefined) {
		clonedStitchingModifier.Description = description as string;
	}

	if (modifier) {
		clonedStitchingModifier.Modifier = Number(modifier);
	}

	if (effectLevel) {
		clonedStitchingModifier.EffectLevel = Number(effectLevel);
	}
};
