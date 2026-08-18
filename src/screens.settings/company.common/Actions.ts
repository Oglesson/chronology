import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import api from "../../api.common";
import {
	GeneralSettingsData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const companyAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "PUT":
				return await updateCompanyAction(queryClient, formData);
		}

		return null;
	};

export const updateCompanyAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient.getQueryCache().find(QUERY_KEYS.settings_general);

	const { data: cachedSettings } = cache?.state
		.data as AxiosResponse<GeneralSettingsData>;

	const settings = ObjectUtilities.deepCopy(cachedSettings);

	delete settings._DefaultGrade;

	const clonedSettings = ObjectUtilities.deepCopy(settings);

	hydrate(clonedSettings, formData);

	if (ObjectUtilities.areEqual(settings, clonedSettings)) {
		return {
			type: "success",
		};
	}

	let errorData: ResponseData | undefined;

	const response = await api
		.updateGeneralSettings(clonedSettings)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(QUERY_KEYS.settings_general);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (clonedSettings: GeneralSettingsData, formData: FormData) => {
	const { defaultGradeId, defaultMadeInPairs, levelOn75To100, minutesInDay } =
		Object.fromEntries(formData.entries());

	if (defaultGradeId) {
		clonedSettings.DefaultGradeID = Number(defaultGradeId);
	}

	if (defaultMadeInPairs) {
		clonedSettings.DefaultMadeInPairs = defaultMadeInPairs === "yes";
	}

	if (levelOn75To100) {
		clonedSettings.LevelOn75To100 = Number(levelOn75To100);
	}

	if (minutesInDay) {
		clonedSettings.MinutesInDay = Number(minutesInDay);
	}
};
