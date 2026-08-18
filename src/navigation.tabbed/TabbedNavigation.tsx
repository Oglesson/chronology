import { NavLink } from "react-router-dom";

type TabbedNavigationItem = {
	hidden?: boolean;
	text: string;
	to: string;
};

type TabbedNavigationProps = {
	items: TabbedNavigationItem[];
};

export const TabbedNavigation = ({
	items,
	...props
}: TabbedNavigationProps) => {
	if (!items.length) {
		return <></>;
	}

	return (
		<nav {...props}>
			<ul className="flex border-b border-b-grey-mid space-x-16">
				{items.map(
					(item) =>
						!item.hidden && (
							<li key={item.to}>
								<NavLink
									end
									to={item.to}
									className={({ isActive }) =>
										[
											"block pb-4 hover:underline focus:underline decoration-2 underline-offset-[19px] decoration-green",
											isActive
												? "pointer-events-none underline"
												: "text-grey-light hover:text-current focus:text-current",
										]
											.filter(Boolean)
											.join(" ")
									}
								>
									{item.text}
								</NavLink>
							</li>
						)
				)}
			</ul>
		</nav>
	);
};
