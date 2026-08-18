import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { FileData } from "../api.common/types";
import { pathFilesQuery } from "../queries.common/pathFilesQuery";

export const usePathFiles = () => {
	const query = useQuery(pathFilesQuery());
	const pathFiles: FileData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<FileData[]>;
		if (data.data) {
			pathFiles.push(...data.data);
		}
	}

	return pathFiles;
};
