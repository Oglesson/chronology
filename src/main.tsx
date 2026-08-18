import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { GlobalContext } from "./context.common/GlobalContext";
import "./i18n";
import "./main.scss";
import { router } from "./routes.common/Router";

ReactDOM.createRoot(document.querySelector("[data-app]") as HTMLElement).render(
	<StrictMode>
		<Suspense fallback="">
			<GlobalContext>
				<RouterProvider router={router} />
			</GlobalContext>
		</Suspense>
	</StrictMode>
);
