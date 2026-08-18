import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { AuditData, AuditQueryData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const auditQuery = (
	auditParams: AuditQueryData
): QueryObserverOptions<AxiosResponse<AuditData[]>> => ({
	queryKey: [QUERY_KEYS.audit_list],
	queryFn: async () => {
		const auditList = await api.getAuditList(auditParams);

		if (!auditList) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return auditList;
	},
	staleTime: 1000 * 60 * 10,
});
