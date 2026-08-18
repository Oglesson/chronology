import { Fragment, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProcessData } from "../../../api.common/types";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import { Button } from "../../../components/common/button/Button";
import Icons from "../../../config.common/Icons";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useToggle } from "../../../hooks.common/useToggle";
import { useProcesses } from "../../../hooks.queries/useProcesses";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { AddGroupProcess } from "./_AddGroupProcess";
import { EditGroupProcess } from "./_EditGroupProcess";
import { FormFooter } from "./_FormFooter";
import { QuestionsContext } from "./_QuestionsContext";
import { RemoveGroupProcess } from "./_RemoveGroupProcess";

export type GroupProcessModalDataProps = {
	defaultValue?: ProcessData;
	index: number;
	isManned: boolean;
	processes: ProcessData[];
};

export const GroupProcessesQuestions = () => {
	const {
		previewMode,
		activeGroupId,
		groups,
		setGroupState,
		groupProcessesQuestionsState,
		setGroupProcessesQuestionsState,
		setGroupSubmit,
		setIsSaving,
	} = useContext(QuestionsContext);

	const { fetcher, isFetching } = useFetcher();

	const currentGroupIndex = groups.findIndex((c) => c.id === activeGroupId);
	const currentGroup = groups[currentGroupIndex];
	const { processes } = useProcesses();
	const mannedProcesses = processes.filter(
		(o) =>
			o._Type_Category !== "ocUnmanned" && o._Type_Category !== "ocGroup",
	);
	const unmannedProcesses = processes.filter(
		(o) => o._Type_Category === "ocUnmanned",
	);
	const [oppositeLength, setOppositeLength] = useState<3 | 5>(
		groupProcessesQuestionsState?.length === 3 ? 5 : 3,
	);
	const [modalData, setModalData] = useState<GroupProcessModalDataProps>({
		index: 0,
		isManned: false,
		processes: unmannedProcesses,
	});
	const [openAddModal, setOpenAddModal] = useToggle(false);
	const [openEditModal, setOpenEditModal] = useToggle(false);
	const [openRemoveModal, setOpenRemoveModal] = useToggle(false);
	const [activeIndex, setActiveIndex] = useState<number>();

	useEffect(() => {
		if (!previewMode) {
			setIsSaving(isFetching);
		}
	}, [isFetching, previewMode, setIsSaving]);

	const handleClick = (length: 3 | 5) => {
		if (!groupProcessesQuestionsState) {
			return;
		}

		setOppositeLength(length === 3 ? 5 : 3);

		setGroupProcessesQuestionsState((previous) => {
			const next = [...(previous || [])];

			while (next.length < length) {
				next.push({});
			}

			if (next.length === length) {
				return next;
			}

			while (next.length > length) {
				next.pop();
			}

			return next;
		});
	};

	return (
		<>
			{!groupProcessesQuestionsState ||
			groupProcessesQuestionsState.length < 1 ? (
				<div className="grid grid-cols-2 gap-x-5">
					<AddGroupProcessSizeButton
						length={3}
						onClick={() => handleClick(3)}
					/>
					<AddGroupProcessSizeButton
						length={5}
						onClick={() => handleClick(5)}
					/>
				</div>
			) : (
				<div className="flex flex-col gap-y-1.5">
					{groupProcessesQuestionsState.map((process, index) => {
						const isManned = !(index % 2);
						const filteredProcesses = isManned
							? mannedProcesses
							: unmannedProcesses;
						return (
							<Fragment key={index}>
								{process.Group_OperationID ? (
									<GroupProcessItem
										code={
											process._GroupOperation
												?.Code as string
										}
										editAction={() => {
											setModalData({
												defaultValue:
													process._GroupOperation,
												index: index,
												isManned: isManned,
												processes: filteredProcesses,
											});
											setOpenEditModal();
										}}
										removeAction={() => {
											setModalData({
												defaultValue:
													process._GroupOperation,
												index: index,
												isManned: isManned,
												processes: filteredProcesses,
											});
											setOpenRemoveModal();
										}}
										isActive={index === activeIndex}
										onToggle={(open) => {
											setActiveIndex(
												open ? index : undefined,
											);
										}}
									/>
								) : (
									<AddGroupProcessButton
										isManned={isManned}
										onClick={() => {
											setModalData({
												index: index,
												isManned: isManned,
												processes: filteredProcesses,
											});
											setOpenAddModal();
										}}
									/>
								)}
							</Fragment>
						);
					})}

					<div className="flex justify-center mt-8">
						<Button
							text={`Change to ${oppositeLength} Processes`}
							style={"secondary"}
							onClick={() => handleClick(oppositeLength)}
						/>
					</div>
				</div>
			)}
			<fetcher.Form
				onSubmit={(_e) => {
					if (currentGroup.state !== "complete") {
						setGroupState(activeGroupId, "error", true);
						return;
					}

					setGroupSubmit(true);
				}}
			>
				<FormFooter />
			</fetcher.Form>
			<AddGroupProcess
				openModal={openAddModal}
				setOpenModal={setOpenAddModal}
				modalData={modalData}
			/>
			<EditGroupProcess
				openModal={openEditModal}
				setOpenModal={setOpenEditModal}
				modalData={modalData}
			/>
			<RemoveGroupProcess
				openModal={openRemoveModal}
				setOpenModal={setOpenRemoveModal}
				modalData={modalData}
			/>
		</>
	);
};

const AddGroupProcessSizeButton = ({
	length,
	onClick,
	...props
}: {
	length: 3 | 5;
	onClick: () => void;
}) => {
	return (
		<div
			className="flex-none rounded-md bg-dashed-light dark:bg-dashed-dark transition-colors ease-hover duration-300 will-change-transform"
			{...props}
		>
			<button
				className="flex flex-col w-full h-full min-h-[20rem] p-8 items-center justify-center rounded-md typo-h5 transition-colors duration-100 ease-hover hover:bg-black"
				onClick={onClick}
				type="button"
			>
				<RenderIcon icon={Icons.Edit.Plus} />
				<span className="mt-4.75">
					Add {length} <br />
					Processes
				</span>
			</button>
		</div>
	);
};

const AddGroupProcessButton = ({
	isManned,
	onClick,
	...props
}: {
	isManned: boolean;
	onClick: () => void;
}) => {
	const { t } = useTranslation();

	return (
		<div
			className="rounded-md bg-dashed-light dark:bg-dashed-dark"
			{...props}
		>
			<button
				className="flex justify-center items-center w-full p-4 rounded-md transition-colors duration-100 ease-hover hover:bg-black"
				onClick={onClick}
			>
				<RenderIcon icon={Icons.Edit.Plus} sizes="w-6 h-8" />
				<span className="ml-3">
					{isManned
						? t("addAMannedOperation", {
								defaultValue: "Add a Manned Process",
							})
						: t("addAnUnmannedOperation", {
								defaultValue: "Add an Unmanned Process",
							})}
				</span>
			</button>
		</div>
	);
};

const GroupProcessItem = ({
	code,
	editAction,
	removeAction,
	isActive,
	onToggle,
	...props
}: {
	code: string;
	editAction: () => void;
	removeAction: () => void;
	isActive: boolean;
	onToggle: (open: boolean) => void;
}) => {
	const { t } = useTranslation();

	return (
		<div
			className={`grid-container w-full p-4 rounded-md cursor-default transition-colors duration-100 ease-hover  ${
				isActive ? "bg-black" : "bg-black-subtle hover:bg-black"
			}    group`}
			{...props}
		>
			<div className="col-span-8 col-start-3 flex items-center justify-center">
				{code}
			</div>
			<div
				className={`col-span-2 flex items-center justify-end ${
					isActive ? "opacity-100" : "opacity-0"
				} group-hover:opacity-100`}
			>
				<ItemActionsMenu
					buttonLabel={t("moreActions", {
						defaultValue: "More Actions",
					})}
					actions={[
						{
							label: t("editOperation", {
								defaultValue: "Edit Process",
							}),
							method: editAction,
						},
						{
							label: t("removeOperation", {
								defaultValue: "Remove Process",
							}),
							method: removeAction,
						},
					]}
					toggle={onToggle}
				/>
			</div>
		</div>
	);
};
