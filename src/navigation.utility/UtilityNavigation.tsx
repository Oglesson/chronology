import { Account } from "./Account";
import { Breadcrumbs } from "./Breadcrumbs";
import { Refresh } from "./Refresh";

export const UtilityNavigation = ({ ...props }) => (
	<div className="flex items-center" {...props}>
		<Breadcrumbs />
		<div className="ml-auto flex items-center space-x-5">
			<Refresh />
			<Account />
		</div>
	</div>
);
