import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { GradeData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import { gradesQuery } from "../queries.common/gradesQuery";

export const useGrades = () => {
	const query = useQuery(gradesQuery());
	const grades: GradeData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<GradeData[]>;
		grades.push(...data.data);
	}

	const gradeOptions = grades
		? grades?.map((grade): SelectOption => {
				return {
					label: grade.Code,
					value: grade.ID,
				};
		  })
		: null;

	return {
		grades,
		gradeOptions,
		gradeCodes: grades?.map((grade) => grade.Code.toLowerCase()),
	};
};
