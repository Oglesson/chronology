import { QueryClient } from "@tanstack/react-query";
import { Method } from "axios";
import { updateCompanyAction } from "../company.common/Actions";

export const performanceAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();
		const { levelOn75To100 } = Object.fromEntries(formData.entries());

		switch (method) {
			case "PUT":
				if (levelOn75To100) {
					return await updateCompanyAction(queryClient, formData);
				}
		}

		return null;
	};
