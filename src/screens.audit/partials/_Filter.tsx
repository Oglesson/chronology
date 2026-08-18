import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../components/common/button/Button";
import { Modal } from "../../components/modal/Modal";
import { Select } from "../../forms.common/Select";
import {
	dataTypes,
	actionTypes,
} from "../../utilities.common/ChronologyConstants";
import { DateInput } from "../../forms.common/DateInput";
import { AuditContext } from "./_AuditsContext";
import { AuditFilters } from "../../api.common/types";
import { Input } from "../../forms.common/Input";
import {
	initialAuditDateParams,
	dateTimeCompare,
} from "../../utilities.common/DateUtilities";

export const Filter = () => {
	const filterSchema = z.object({
		DateFrom: z.string().optional(),
		DateTo: z.string().optional(),
		User: z.string().optional(),
		Sections: z
			.union([z.string(), z.literal("All"), z.literal("")])
			.optional(),
		SectionActions: z
			.union([z.string(), z.literal("All"), z.literal("")])
			.optional(),
	});

	type FilterFormData = z.infer<typeof filterSchema>;

	const {
		setFilterValues,
		openFilterModal,
		setOpenFilterModal,
		defaultFilterValues,
	} = useContext(AuditContext);

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		register,
		setError,
		clearErrors,
		watch,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(filterSchema),
	});
	const onSubmit = (data: FilterFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const { t } = useTranslation();

	const resetForm = () => {
		reset(defaultFilterValues);
		setFilterValues(defaultFilterValues);
	};

	const watchDateTo = watch("DateTo");
	const watchDateFrom = watch("DateFrom");

	useEffect(() => {
		if (dateTimeCompare(watchDateTo as string, watchDateFrom as string)) {
			setError("DateTo", {
				type: "custom",
				message: "Date To must be a later date than Date From",
			});
		} else {
			clearErrors(["DateTo"]);
		}
	}, [watchDateTo, watchDateFrom, setError, clearErrors]);

	return (
		<Modal
			alignment="right"
			isOpen={openFilterModal}
			width="w-[34rem]"
			height="h-full"
		>
			<form
				className="flex flex-col min-h-full"
				onSubmit={(e) => {
					if (!isValid) {
						handleSubmit(onSubmit, onSubmitError)(e);

						return;
					}
					e.preventDefault();

					const formValues = getValues();
					const filterValuess: AuditFilters = {};
					for (const [key, value] of Object.entries(formValues) as Array<[keyof AuditFilters, string | undefined]>) {
						if (value !== "All" && value !== "")
							filterValuess[key] = value;
					}

					setFilterValues(filterValuess);
					setOpenFilterModal(false);
				}}
			>
				<h2 className="typo-h3 mb-6">{t("filter")}</h2>
				<DateInput
					defaultValue={defaultFilterValues.DateFrom}
					name="DateFrom"
					error={errors.DateFrom}
					htmlFor="DateFrom"
					label={t("dateFrom")}
					register={register}
					max={initialAuditDateParams().DateTo}
				/>
				<DateInput
					defaultValue={defaultFilterValues.DateTo}
					name="DateTo"
					error={errors.DateTo}
					htmlFor="DateTo"
					label={t("dateTo")}
					register={register}
					max={initialAuditDateParams().DateTo}
				/>
				<Input
					error={errors.User}
					htmlFor="User"
					label={t("username")}
					name="User"
					register={register}
					defaultValue={defaultFilterValues.User}
				/>
				<Select
					control={control}
					defaultValue={defaultFilterValues.Sections}
					name="Sections"
					error={errors.Sections}
					htmlFor="Sections"
					label={t("dataType")}
					options={[{ label: "All", value: "All" }, ...dataTypes]}
					placeholder={`${t("selectAType")}...`}
				/>
				<Select
					control={control}
					defaultValue={defaultFilterValues.SectionActions}
					name="SectionActions"
					error={errors.SectionActions}
					htmlFor="SectionActions"
					label={t("actionType")}
					options={[{ label: "All", value: "All" }, ...actionTypes]}
					placeholder={`${t("selectAType")}...`}
				/>

				<div className="flex justify-end items-end mt-auto pt-12 gap-6">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={() => setOpenFilterModal(false)}
					/>
					<Button
						style="secondary"
						text={t("reset")}
						onClick={resetForm}
					/>
					<Button text={t("apply")} type="submit" />
				</div>
			</form>
		</Modal>
	);
};
