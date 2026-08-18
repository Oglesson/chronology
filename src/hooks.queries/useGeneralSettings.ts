import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { GeneralSettingsData } from "../api.common/types";
import { generalSettingsQuery } from "../queries.common/generalSettingsQuery";

export const useGeneralSettings = () => {
	const query = useQuery(generalSettingsQuery());
	const generalSettings = query.data as AxiosResponse<GeneralSettingsData>;

	return generalSettings?.data ?? {};
};
