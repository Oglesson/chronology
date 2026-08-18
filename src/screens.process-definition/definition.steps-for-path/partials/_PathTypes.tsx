import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { BlockNavigation } from "../../../components/modal/BlockNavigation";
import { ScrollDrag } from "../../../components/scroll-drag/ScrollDrag";
import { PATH_COLORS } from "../../../constants.common/path";
import { RADII } from "../../../constants.common/radii";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";
import { PathTypeActions } from "./_Actions";
import { AddPathType } from "./_AddPathType";
import { EditPathType } from "./_EditPathType";
import { RemovePathType } from "./_RemovePathType";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { useSteps } from "../../../hooks.queries/useSteps";
import { Tooltip } from "../../../components/common/tooltip/Tooltip";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import Icons from "../../../config.common/Icons";
import { useTheme } from "../../../context.common/ThemeContext";

export const PathTypes = () => {
	const definition = useProcessDefinition();
	const { steps } = useSteps();
	const { canSave, pathTypes } = useContext(DefinitionContext);
	const [activePathType, setActivePathType] = useState<number>();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();
	const [theme] = useTheme();

	return (
		<>
			{(permissions?.edit || permissions?.admin) && <BlockNavigation isBlocked={canSave} />}
			<ScrollDrag
				className="-mx-6.5 -mb-6.5 px-6.5 pb-20"
				windowVertical={true}
			>
				<div>
					<h4 className="typo-h4 mb-12">Path types</h4>
					<div className="flex gap-x-5">
						{pathTypes && pathTypes.length > 0 && (
							<>
								<div className="flex-none min-w-[6.25rem]">
									<h5 className="flex items-center h-14 text-grey-light whitespace-nowrap">
										{t("radius")}
									</h5>
									<ul className="py-7">
										{RADII.map((r) => (
											<li key={r} className="py-2.5">
												{r}
											</li>
										))}
									</ul>
								</div>
								{pathTypes.map((pathType, index) => {
									if (!pathType) {
										return <></>;
									}

									return (
										<div
											key={`${pathType.ID}-${index}`}
											className={`flex-none min-w-[13.125rem] rounded-md transition-colors duration-100 ease-hover group ${
												activePathType === index
													? "bg-grey-lightest dark:bg-black"
													: "hover:bg-grey-lightest dark:hover:bg-black-subtle"
											}`}
										>
											<div className="flex items-center h-14 px-3">
												<div
													data-index={index}
													className={`flex-none w-2.5 h-2.5 mr-2 rounded-full ${
														!theme.useDarkTheme &&
														index === 0
															? "ring-1 ring-grey-light"
															: ""
													}`}
													style={{
														background:
															PATH_COLORS[index],
													}}
												></div>
												<h5 className="mr-3 text-grey-light whitespace-nowrap">
													{pathType?.Name}
												</h5>
												{permissions
													.operationdefinitions
													?.edit && (
													<PathTypeActions
														pathTypeIndex={index}
														activePathType={
															activePathType
														}
														setActivePathType={
															setActivePathType
														}
													/>
												)}
											</div>
											<ul className="p-7">
												{pathType.PathtypesSteps &&
													pathType.PathtypesSteps.map(
														(step, stepIndex) => {
															return (
																<li
																	key={`${step.ID}-${stepIndex}-${index}`}
																	className="py-2.5 flex gap-2 items-center"
																>
																	{!steps.some(
																		(el) =>
																			el.ID ===
																			step.StepID,
																	) && (
																		<Tooltip
																			theme="error"
																			content={t(
																				"tooltipStepRemovedError",
																			)}
																			className="-my-1"
																		>
																			<RenderIcon
																				icon={
																					Icons
																						.Interface
																						.Warning
																				}
																				classes="text-decline"
																			/>
																		</Tooltip>
																	)}
																	{
																		step
																			?._Step
																			?.Code
																	}
																</li>
															);
														},
													)}
											</ul>
										</div>
									);
								})}
							</>
						)}
						{(permissions?.edit || permissions?.admin) &&
							pathTypes &&
							pathTypes.length <= 6 && <AddPathType />}
					</div>
					{(permissions?.edit || permissions?.admin) &&
						!definition.IsInUseByOp &&
						pathTypes &&
						pathTypes.length > 0 && <EditPathType />}
					{(permissions?.edit || permissions?.admin) &&
						!definition.IsInUseByOp &&
						pathTypes &&
						pathTypes.length > 0 && <RemovePathType />}
				</div>
			</ScrollDrag>
		</>
	);
};
