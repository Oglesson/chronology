import { useQuery } from "@tanstack/react-query";
import { processTypesQuery } from "../queries.common/processTypesQuery";

export const useProcessTypes = () => {
	const query = useQuery(processTypesQuery());
	const processTypes = query.data;

	return {
		groupedProcessTypes: processTypes?.groupedProcessTypes || {},
		processClasses: processTypes?.processClasses || [],
	};
};
