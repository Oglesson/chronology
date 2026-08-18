import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { CuttingStepSettingData } from "../api.common/types";
import { cuttingStepsSettingsQuery } from "../queries.common/cuttingStepsSettingsQuery";

export const useCuttingStepsSettings = () => {
	const query = useQuery(cuttingStepsSettingsQuery());
	const cuttingStepsSettings = query.data as AxiosResponse<
		CuttingStepSettingData[]
	>;

	return cuttingStepsSettings?.data ?? [];
};
