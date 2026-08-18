import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { PathFeatureData } from "../api.common/types";
import { pathFeaturesQuery } from "../queries.common/pathFeaturesQuery";

export const usePathFeatures = () => {
	const query = useQuery(pathFeaturesQuery());
	const pathFeatures = query.data as AxiosResponse<PathFeatureData[]>;

	return pathFeatures?.data ?? [];
};
