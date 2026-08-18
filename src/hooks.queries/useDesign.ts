import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { DesignData } from "../api.common/types";
import { designQuery } from "../queries.common/designQuery";

export const useDesign = () => {
	const params = useParams();
	const query = useQuery(designQuery(params.id as string));
	const style = query.data as AxiosResponse<DesignData>;

	return style?.data ?? {};
};
