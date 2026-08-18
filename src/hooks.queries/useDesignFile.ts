import { useQuery } from "@tanstack/react-query";
import { designFileQuery } from "../queries.common/designFileQuery";

export const useDesignFile = (fileName: string) => {
	const query = useQuery(designFileQuery(fileName));
	const data = query.data;

	return data ?? { fileName: "", filePath: "" };
};
