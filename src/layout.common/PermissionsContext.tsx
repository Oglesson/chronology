import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";
import { z } from "zod";
import { QUERY_KEYS } from "../constants.common/queryKeys";
import { usePermissions } from "../hooks.common/usePermissions";

const permissionsSchema = z.object({
	admin: z.boolean().optional(),
	edit: z.boolean().optional(),
	read: z.boolean().optional(),
});

type Permissions = z.infer<typeof permissionsSchema>;

type PermissionsContext = {
	permissions: Permissions;
};

// eslint-disable-next-line react-refresh/only-export-components
export const PermissionsContext = createContext<PermissionsContext>({
	permissions: {},
});

interface PermissionsProviderProps {
	children?: ReactNode;
}

export const PermissionsProvider = ({
	children,
	...props
}: PermissionsProviderProps) => {
	const { permissions } = usePermissions();
	const queryClient = useQueryClient();
	const groupedPermissions = permissions?.reduce(
		(r: Permissions, a: string) => {
			r[a as keyof Permissions] = true;

			return r;
		},
		{} as Permissions,
	);

	const parsedPermissions = permissionsSchema.parse(groupedPermissions);

	queryClient.setQueryData([QUERY_KEYS.is_admin], parsedPermissions.admin);

	return (
		<PermissionsContext.Provider
			value={{
				permissions: parsedPermissions,
			}}
			{...props}
		>
			{children}
		</PermissionsContext.Provider>
	);
};
