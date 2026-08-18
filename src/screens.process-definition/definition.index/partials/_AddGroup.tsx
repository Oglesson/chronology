import { UniqueIdentifier } from "@dnd-kit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { Select, SelectOption } from "../../../forms.common/Select";
import { useToggle } from "../../../hooks.common/useToggle";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { useProcessDefinitionCategories } from "../../../hooks.queries/useProcessDefinitionCategories";
import { useCategoryIdFieldSchema } from "../../../hooks.schema/fields";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { DefinitionContext } from "./_DefinitionContext";

export const AddGroup = () => {
	const categoryIdFieldSchema = useCategoryIdFieldSchema();
	type GroupFormData = z.infer<typeof categoryIdFieldSchema>;
	const definition = useProcessDefinition();
	const categories = useProcessDefinitionCategories();
	const { containers, setGroups, setItems, setContainers } =
		useContext(DefinitionContext);
	const categoryOptions = categories
		.filter((c) =>
			definition.Handling
				? c.ColumnType === "ctHandling"
				: c.ColumnType === "ctTask" ||
				  c.ColumnType === "ctTaskAlternativeToPath"
		)
		.reduce((filtered, category) => {
			if (category.ID && !containers.includes(category.ID)) {
				filtered.push({
					label: category.Description,
					value: category.ID,
				});
			}
			return filtered;
		}, [] as SelectOption[]);
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const {
		control,
		getValues,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(categoryIdFieldSchema),
	});
	const onSubmit = (data: GroupFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	useEffect(() => {
		if (openModal) {
			reset();
		}
	}, [openModal, reset]);

	return (
		<div className="flex-none w-110 mr-4.75 rounded-md bg-dashed-light dark:bg-dashed-dark transition-colors ease-hover duration-300 will-change-transform">
			<button
				className={
					"flex flex-col w-full h-full min-h-[16.25rem] p-8 items-center justify-center rounded-md typo-h5 " +
					(definition.IsInUseByOp
						? "opacity-30"
						: "transition-colors duration-100 ease-hover hover:bg-grey-lighter dark:hover:bg-black")
				}
				type="button"
				onClick={setOpenModal}
				disabled={definition.IsInUseByOp}
			>
				<RenderIcon icon={Icons.Edit.Plus} />
				<span className="mt-4.75 w-28">{t("addACategory")}</span>
				{definition.IsInUseByOp && <span> ({t("inUse")})</span>}
			</button>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">{t("addACategory")}</h2>
				<form
					onSubmit={(e) => {
						if (!isValid) {
							handleSubmit(onSubmit, onSubmitError)(e);

							return;
						}

						e.preventDefault();

						const { categoryId } = getValues();

						const category = categories.find(
							(c) => c.ID === Number(categoryId)
						);

						if (category) {
							setContainers((previous) => {
								const next = [...previous];
								next.push(category.ID as UniqueIdentifier);
								next.sort((a, b) => {
									return (a as number) - (b as number);
								});

								return next;
							});

							setItems((previous) => {
								const next = { ...previous };
								next[category.ID as number] = [];

								return next;
							});

							setGroups((previous) => {
								const next = [...(previous ?? [])];

								next.push({
									QuestionColumnDescription:
										category.Description,
									QuestionColumnID: category.ID,
									Questions: [],
								});

								return next;
							});
						}

						setOpenModal();
					}}
				>
					<Select
						control={control}
						name="categoryId"
						error={errors.categoryId}
						htmlFor="categoryId"
						label={t("category")}
						options={categoryOptions}
					/>
					<div className="flex justify-end items-end mt-12 gap-6">
						<Button
							style="secondary"
							text={t("cancel")}
							onClick={setOpenModal}
						/>
						<Button text={t("create")} type="submit" />
					</div>
				</form>
			</Modal>
		</div>
	);
};
