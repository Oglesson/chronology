import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { DepartmentData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import { departmentSettingsQuery } from "../queries.common/departmentSettingsQuery";

export const useDepartments = () => {
	const query = useQuery(departmentSettingsQuery());
	const { t } = useTranslation();
	const departments: DepartmentData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<DepartmentData[]>;
		departments.push(...data.data);
	}

	const departmentOptions = departments?.map((department): SelectOption => {
		return { label: department?.Description, value: department?.ID };
	});

	const departmentFilterOptions = departments?.map(
		(department): SelectOption => {
			return {
				label: department?.Description,
				value: department?.Description,
			};
		}
	);

	const departmentOptionsWithNone = departments?.map(
		(department): SelectOption => {
			return { label: department?.Description, value: department?.ID };
		}
	);

	departmentOptionsWithNone.unshift({ value: "null", label: t("none") });

	return {
		departments,
		departmentOptions,
		departmentOptionsWithNone,
		departmentFilterOptions,
	};
};
