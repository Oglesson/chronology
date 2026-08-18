import { ReactNode, useEffect, useState } from "react";
import { useMatches } from "react-router-dom";

type RouteHandle = {
	breadcrumb?: (data: unknown) => ReactNode | Promise<ReactNode>;
};

export const Breadcrumbs = ({ ...props }) => {
	const matches = useMatches();
	const [crumbs, setCrumbs] = useState<ReactNode[]>([]);

	useEffect(() => {
		const matchingCrumbs = matches.filter((match) =>
			Boolean((match.handle as RouteHandle)?.breadcrumb)
		);

		async function handleCrumbs() {
			const result: ReactNode[] = [];

			for (const match of matchingCrumbs) {
				const crumb = await (match.handle as RouteHandle)?.breadcrumb?.(
					match.data
				);

				result.push(crumb);
			}

			setCrumbs(result.flat() as ReactNode[]);
		}

		handleCrumbs().catch((e) => e);
	}, [matches]);

	return (
		<nav {...props}>
			<ol className="flex">
				{crumbs.map((item, index) => (
					<li key={index}>
						<span
							className={
								index !== crumbs.length - 1
									? ""
									: "text-grey-light pointer-events-none"
							}
						>
							{item}
						</span>
						{index !== crumbs.length - 1 && (
							<span className="inline-block mx-3">/</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
};
