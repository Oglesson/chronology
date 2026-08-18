import {
	DetailedHTMLProps,
	DetailsHTMLAttributes,
	ReactNode,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
	ActionProps,
	ItemActionsMenu,
} from "../ItemActionsMenu/ItemActionsMenu";
import Icons from "../../config.common/Icons";
import { RenderIcon } from "../../utilities.common/RenderIcon";

type AccordionProps = DetailedHTMLProps<
	DetailsHTMLAttributes<HTMLDetailsElement>,
	HTMLDetailsElement
> & {
	actions?: {
		interactionIntent?: () => void | Promise<void>;
		items: ActionProps[];
	};
	children: ReactNode;
	toggle?: (isOpen: boolean) => void;
	summary: ReactNode;
};

export const Accordion = ({
	actions,
	children,
	className,
	open,
	toggle,
	summary,
	...props
}: AccordionProps) => {
	const ref = useRef<HTMLDetailsElement>(null);
	const [prevOpenProp, setPrevOpenProp] = useState(open);
	const [isOpen, setIsOpen] = useState(!!open);
	const { t } = useTranslation();

	if (prevOpenProp !== open) {
		setPrevOpenProp(open);
		setIsOpen(!!open);
	}

	return (
		<details
			className={`bg-grey-lightest dark:bg-black-subtle mb-6 rounded-md ${
				className ?? ""
			}`}
			onToggle={(event) => {
				if (ref.current) {
					setIsOpen(ref.current.open);
					toggle?.(ref.current.open);
				}
				props.onToggle?.(event);
			}}
			open={isOpen}
			ref={ref}
			{...props}
		>
			<summary className="select-none">
				<div className="flex px-6 py-7 items-center">
					<div className="typo-h4 w-full">{summary}</div>
					{actions?.items && (
						<ItemActionsMenu
							actions={actions.items}
							buttonIcon={Icons.Interface.MoreHorizontal}
							buttonLabel={t("moreActions", {
								defaultValue: "More Actions",
							})}
							className="ml-5 opacity-0 open:opacity-100 [details:hover_&]:opacity-100 [details[open]_&]:opacity-100"
							interactionIntent={actions.interactionIntent}
						/>
					)}
					<RenderIcon
						classes="ml-5 [details[open]_&]:rotate-180"
						icon={Icons.Interface.ArrowDownBig}
					/>
				</div>
			</summary>
			<div className="pt-3 px-6 pb-10">{children}</div>
		</details>
	);
};
