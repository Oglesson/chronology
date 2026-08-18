import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { MachineData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import { machinesQuery } from "../queries.common/machinesQuery";

export const useMachines = () => {
	const query = useQuery(machinesQuery());
	const machines: MachineData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<MachineData[]>;
		machines.push(...data.data);
	}

	const machineOptions = machines?.map((machine): SelectOption => {
		return {
			label: machine?.Code,
			value: machine?.ID,
		};
	});

	return {
		machines,
		machineOptions,
		machineCodes: machines?.map((machine) => machine.Code.toLowerCase()),
	};
};
