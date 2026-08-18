import { TabPanel, Tabs, Tab } from "@mui/base";
import { ReactNode, SyntheticEvent } from "react";

import "./horizontal-tabs.scss";

export type HorizontalTab = {
	content: ReactNode;
	label: ReactNode;
	value: string;
};

type HorizontalTabsProps = {
	classes?: string;
	content?: ReactNode;
	defaultValue?: string;
	onChange?: (event: SyntheticEvent, value: string | number | boolean) => void;
	tabs: HorizontalTab[];
};

export const HorizontalTabs = ({
	classes,
	content,
	defaultValue,
	onChange,
	tabs,
	...props
}: HorizontalTabsProps) => {
	if (!tabs.length) {
		return <></>;
	}

	return (
		<Tabs
			defaultValue={defaultValue ?? tabs[0].value}
			onChange={onChange}
			{...props}
		>
			<div className={classes}>
				{content}
				<ul className="horizontal-tabs">
					{tabs.map((tab) => (
						<li key={tab.value} className="horizontal-tabs__item">
							<Tab
								value={tab.value}
								slotProps={{
									root: {
										className: "horizontal-tabs__button",
									},
								}}
							>
								{tab.label}
							</Tab>
						</li>
					))}
				</ul>
			</div>
			{tabs.map((tab) => (
				<TabPanel key={tab.value} value={tab.value}>
					{tab.content}
				</TabPanel>
			))}
		</Tabs>
	);
};
