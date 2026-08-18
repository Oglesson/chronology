import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { MachiningAmendmentData } from "../api.common/types";
import {
	machiningAmendmentsQuery,
	machiningAmendmentsByCategoryQuery,
} from "../queries.common/machiningAmendmentsQuery";

export const useMachiningAmendments = () => {
	const query = useQuery(machiningAmendmentsQuery());
	const machiningAmendments = query.data as AxiosResponse<
		MachiningAmendmentData[]
	>;

	return machiningAmendments?.data ?? [];
};

export const useMachiningAmendmentsByCategory = (id: number) => {
	const query = useQuery(machiningAmendmentsByCategoryQuery(id));
	const machiningAmendments = query.data as AxiosResponse<
		MachiningAmendmentData[]
	>;

	const amendList = machiningAmendments?.data ?? [];

	return amendList?.map((amendment) => {
		return { ID: amendment.ID, Description: amendment.Description };
	});
};
