import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { FileData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const pathFilesQuery = (): QueryObserverOptions<
	AxiosResponse<FileData[]>
> => ({
	queryKey: [QUERY_KEYS.path_files],
	queryFn: async () => {
		const pathFiles = await api.getPathFiles().catch((e) => {
			return e;
		});

		if (!pathFiles) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return pathFiles;
	},
	staleTime: 1000 * 60 * 15,
});
