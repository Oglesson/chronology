import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ProcessDefinitionsDefaultCuttingData } from "../api.common/types";
import { defaultCuttingSettingsQuery } from "../queries.common/defaultCuttingSettingsQuery";

export const useDefaultCuttingSettings = () => {
	const query = useQuery(defaultCuttingSettingsQuery());
	const settings =
		query.data as AxiosResponse<ProcessDefinitionsDefaultCuttingData>;

	return settings?.data ?? {};
};
