import { useContext } from "react";
import { BarChart } from "../../../components/charts/BarChart";
import { DesignDepartmentContext } from "./_DesignDepartmentContext";

export const DepartmentProcessesChart = () => {
	const { styleProcesses } = useContext(DesignDepartmentContext);

	return (
		<>
			<BarChart
				colors={["#00F3BB", "#f94c40"]}
				data={styleProcesses.map((process) => {
					return {
						name: process._Operation?.Code || "",
						values: [
							process._Operation?.Calculations?.Allowed_Time
								.Minutes.Costed_VA || 0,
							process._Operation?.Calculations?.Allowed_Time
								.Minutes.Costed_NVA || 0,
						],
					};
				})}
				height={400}
				labels={["VA", "NVA"]}
				totalHeading={"AMS"}
			/>
		</>
	);
};
