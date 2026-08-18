import { UniqueIdentifier, useDndContext } from "@dnd-kit/core";
import { useContext } from "react";
import Icons from "../../config.common/Icons";
import { StepLinkActionData } from "../../hooks.queries/useStep";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { ItemsContext } from "./_ActionItemsContext";

type LinksProps = {
	handleLinkToggle: (id?: UniqueIdentifier) => void;
	items: StepLinkActionData[];
	overIndex: number | undefined;
};

export const Links = ({
	handleLinkToggle,
	items,
	overIndex,
	...props
}: LinksProps) => {
	const { active } = useDndContext();
	const { canSave, setCanSave } = useContext(ItemsContext);
	const { permissions } = usePermissionsContext();

	return (
		<table className="table table-fixed" {...props}>
			<thead>
				<tr>
					<th className="table__th !pb-6 whitespace-nowrap opacity-0">
						Linked
					</th>
				</tr>
			</thead>
			{items.map((m, index) => {
				const isOver = overIndex === index;
				const isDisabled =
					(index === 1 && overIndex !== 0) ||
					(m.collapsed && !isOver);
				return (
					<tbody
						className={`${
							active
								? "transition-[height] ease-hover duration-300"
								: ""
						}
						${m.collapsed ? (isOver ? "h-[86px]" : "h-[10px]") : "h-[66px]"}`}
						data-key={m.ID}
						key={m.ID}
					>
						<tr>
							<td className="relative !p-0">
								{index !== 0 && (
									<button
										className={`absolute flex items-center justify-center w-10 h-10 hover:text-green ${
											m.SimoLinkPrev
												? "text-green"
												: "text-grey-mid"
										} ${
											m.collapsed
												? "top-[-15px]"
												: "top-[-25px]"
										} left-1/2 -translate-x-1/2 ${
											isDisabled ? "opacity-0" : ""
										} ${
											!(permissions?.edit || permissions?.admin)
												? "pointer-events-none"
												: ""
										} ease-hover transition-opacity duration-300}`}
										disabled={
											!(permissions?.edit || permissions?.admin) || isDisabled
										}
										onClick={(e) => {
											e.preventDefault();
											handleLinkToggle(m.ID);
											if (!canSave) {
												setCanSave(true);
											}
										}}
										type="button"
									>
										<RenderIcon
											icon={Icons.Interface.Linked}
											classes="ease-hover transition-colors duration-100`"
										/>
									</button>
								)}
							</td>
						</tr>
					</tbody>
				);
			})}
		</table>
	);
};
