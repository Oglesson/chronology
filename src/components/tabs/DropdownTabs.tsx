import { TabPanel, Tabs, Tab } from "@mui/base";
import {
	ReactNode,
	SyntheticEvent,
	useRef,
	useState,
} from "react";
import Icons from "../../config.common/Icons";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import "./dropdown-tabs.scss";

export type DropdownTab = {
	content: ReactNode;
	label: string;
	value: string;
};

type DropdownTabsProps = {
	classes?: string;
	defaultValue?: string;
	onChange?:
		| ((
				event: SyntheticEvent<Element, Event>,
				value: string | number | boolean,
		  ) => void)
		| undefined;
	tabs: DropdownTab[];
};

export const DropdownTabs = ({
	classes,
	defaultValue,
	onChange,
	tabs,
	...props
}: DropdownTabsProps) => {
	const [activeValue, setActiveValue] = useState<string | number | boolean>(
		defaultValue ?? tabs[0].value,
	);
	const activeTab = tabs.find((tab) => tab.value === activeValue);
	const detailsRef = useRef<HTMLDetailsElement>(null);

	if (!tabs.length) {
		return <></>;
	}

	return (
		<Tabs
			defaultValue={defaultValue ?? tabs[0].value}
			onChange={(e, v) => {
				setActiveValue(v as string | number | boolean);
				if (detailsRef.current) detailsRef.current.open = false;
				onChange?.(e as SyntheticEvent<Element, Event>, v as string | number | boolean);
			}}
			orientation="vertical"
			{...props}
		>
			<details
				ref={detailsRef}
				className={`dropdown-tabs ${classes ?? ""}`}
			>
				<summary className="dropdown-tabs__summary" tabIndex={0}>
					<span className="dropdown-tabs__summary-inner">
						<span className="dropdown-tabs__summary-text">
							{activeTab?.label}
						</span>
						<RenderIcon
							icon={Icons.Interface.ArrowDownSmall}
							classes="dropdown-tabs__summary-icon"
							sizes=""
						/>
					</span>
				</summary>
				<ul className="dropdown-tabs__menu">
					{tabs.map(
						(tab) =>
							tab.value !== activeValue && (
								<li
									key={tab.value}
									className="dropdown-tabs__item"
								>
									<Tab
										value={tab.value}
										slotProps={{
											root: {
												className:
													"dropdown-tabs__button",
											},
										}}
									>
										{tab.label}
									</Tab>
								</li>
							),
					)}
				</ul>
			</details>
			{tabs.map((tab) => (
				<TabPanel key={tab.value} value={tab.value}>
					{tab.content}
				</TabPanel>
			))}
		</Tabs>
	);
};
