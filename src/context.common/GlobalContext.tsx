import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { NavigationProvider } from "./NavigationContext";
import { NotificationProvider } from "./NotificationContext";
import { ThemeProvider } from "./ThemeContext";

interface GlobalContextProps {
	children?: ReactNode;
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 3,
		},
	},
});

export const GlobalContext = ({ children, ...props }: GlobalContextProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			<NavigationProvider>
				<ThemeProvider {...props}>
					<NotificationProvider>{children}</NotificationProvider>
				</ThemeProvider>
			</NavigationProvider>
			<ReactQueryDevtools position="bottom-left" />
		</QueryClientProvider>
	);
};
