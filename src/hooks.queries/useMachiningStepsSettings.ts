import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { MachiningStepSettingData } from "../api.common/types";
import { machiningStepsSettingsQuery } from "../queries.common/machiningStepsSettingsQuery";

export const useMachiningStepsSettings = () => {
	const query = useQuery(machiningStepsSettingsQuery());
	const machiningStepsSettings = query.data as AxiosResponse<
		MachiningStepSettingData[]
	>;

	return machiningStepsSettings?.data ?? [];
};
