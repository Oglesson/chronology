import { useQuery } from "@tanstack/react-query";
import { processFileQuery } from "../queries.common/processFileQuery";

export const useProcessFile = (fileName: string) => {
	const query = useQuery(processFileQuery(fileName));
	const data = query.data;

	return data ?? { fileName: "", filePath: "" };
};
