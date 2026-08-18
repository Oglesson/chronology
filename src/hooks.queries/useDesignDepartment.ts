import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { DesignDepartmentData } from "../api.common/types";
import { designDepartmentQuery } from "../queries.common/designDepartmentQuery";

export const useDesignDepartment = () => {
	const params = useParams();
	const query = useQuery(designDepartmentQuery(params.departmentId as string));
	const styleDepartment = query.data as AxiosResponse<DesignDepartmentData>;

	return styleDepartment?.data ?? {};
};
