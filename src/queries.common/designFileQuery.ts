import { QueryObserverOptions } from "@tanstack/react-query";
import api from "../api.common";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const designFileQuery = (
	fileName: string
): QueryObserverOptions<{ filePath: string; fileName: string }> => ({
	queryKey: [QUERY_KEYS.design_file, fileName],
	queryFn: async () => {
		if (!fileName) {
			return {
				fileName: "",
				filePath: "",
			};
		}

		const file = await api.getStyleFile(fileName);

		if (!file || !file.data) {
			throw new Response("", {
				status: 404,
				statusText: `File with name ${fileName} could not be found.`,
			});
		}

		return { filePath: URL.createObjectURL(file.data), fileName };
	},
	staleTime: 1000 * 60 * 60,
});
