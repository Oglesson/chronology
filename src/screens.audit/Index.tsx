import { AwaitLoaderData } from "../components/common/loader/AwaitLoaderData";
import { Listing } from "./partials/_Listing";
import { usePermissionsContext } from "../hooks.common/usePermissionsContext";
import { AuditContextProvider } from "./partials/_AuditsContext";

export const Audit = () => {
	const { permissions } = usePermissionsContext();

	if (permissions.admin) {
		return (
			<>
				<div className="flex justify-between items-baseline mb-16">
					<h1 className="typo-large mr-5">Audit</h1>
				</div>
				<AwaitLoaderData>
					<AuditContextProvider>
						<Listing />
					</AuditContextProvider>
				</AwaitLoaderData>
			</>
		);
	} else {
		return <p>Page unavailable.</p>;
	}
};
