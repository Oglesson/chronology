import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
	AuditData,
	AuditQueryData,
} from "../api.common/types";
import { auditQuery } from "../queries.common/auditQuery";

export const useAuditList = (auditParams?: AuditQueryData) => {
	const query = useQuery(auditQuery(auditParams ?? {}));
	const data = query.data as AxiosResponse<AuditData[]>;
	const auditList = data?.data;

	return {
		auditList,
	};
};
