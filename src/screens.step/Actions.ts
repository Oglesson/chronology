import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import { Params, redirect } from "react-router-dom";
import api from "../api.common";
import {
	StepData,
	StepActionData,
	ResponseData,
	ResponseMessage,
} from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";
import {
	StepHandActionData,
	StepLinkActionData,
} from "../hooks.queries/useStep";
import ObjectUtilities from "../utilities.common/ObjectUtilities";

export const stepAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteStepAction(queryClient, formData);
			case "PUT":
				return await updateStepAction(queryClient, formData, params);
			case "POST":
				return await copyStepAction(queryClient, formData);
		}

		return null;
	};

export const notesAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "PUT":
				return await updateStepAction(queryClient, formData, params);
		}

		return null;
	};

const deleteStepAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const id = formData.get("id");
	const cache = queryClient.getQueryCache().find([QUERY_KEYS.step, id]);

	const { data: cachedStep } = cache?.state
		.data as AxiosResponse<StepData>;

	if (cachedStep?.Actions) {
		for (const action of cachedStep.Actions) {
			if (action.LHActionID) {
				await queryClient.invalidateQueries({queryKey: [
					QUERY_KEYS.action,
					action.LHActionID.toString(),
				]});
			}

			if (action.RHActionID) {
				await queryClient.invalidateQueries({queryKey: [
					QUERY_KEYS.action,
					action.RHActionID.toString(),
				]});
			}
		}
	}

	let errorData: ResponseData | undefined;

	await api.deleteStep(Number(id)).catch((e: AxiosError) => {
		errorData = {
			code: e.response?.status,
			message: e.response?.statusText,
			responseMessage: e.response?.data as ResponseMessage,
			type: "error",
		};
	});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.steps]});
	queryClient.removeQueries({queryKey: [QUERY_KEYS.step, id]});

	return redirect("/steps");
};

const copyStepAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const step = await api
		.copyStep({
			Code: (formData.get("identifier") as string).toUpperCase(),
			ID: Number(formData.get("id")),
		})
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.steps]});

	return redirect(`/steps/${step?.data?.ID}`);
};

const updateStepAction = async (
	queryClient: QueryClient,
	formData: FormData,
	params: Params
) => {
	const cache = queryClient
		.getQueryCache()
		.find([QUERY_KEYS.step, params.id]);

	const { data: cachedStep } = cache?.state
		.data as AxiosResponse<StepData>;

	const step = ObjectUtilities.deepCopy(cachedStep);
	const clonedElement = ObjectUtilities.deepCopy(step);

	hydrate(clonedElement, formData);

	let errorData: ResponseData | undefined;

	const response = await api
		.updateStep(clonedElement)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	if (clonedElement.Actions) {
		for (const action of clonedElement.Actions) {
			if (action.LHActionID) {
				await queryClient.invalidateQueries({queryKey: [
					QUERY_KEYS.action,
					action.LHActionID.toString(),
				]});
			}

			if (action.RHActionID) {
				await queryClient.invalidateQueries({queryKey: [
					QUERY_KEYS.action,
					action.RHActionID.toString(),
				]});
			}
		}
	}

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.steps]});
	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.step, params.id]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (clonedElement: StepData, formData: FormData) => {
	const { code, description, items, notes, valueAdded } = Object.fromEntries(
		formData.entries()
	);

	clonedElement.UpdateMap = {
		Header: false,
		Actions: false,
	};

	if (code) {
		clonedElement.UpdateMap.Header = true;
		clonedElement.Code = (code as string).toUpperCase();
	}

	if (description !== undefined) {
		clonedElement.UpdateMap.Header = true;
		clonedElement.Description = description as string;
	}

	if (items) {
		clonedElement.UpdateMap.Actions = true;
		clonedElement.Actions = mapItems(items as string);
	}

	if (notes !== undefined) {
		clonedElement.UpdateMap.Header = true;
		clonedElement.Notes = notes as string;
	}

	if (valueAdded) {
		clonedElement.UpdateMap.Header = true;
		clonedElement.ValueAdded = valueAdded === "yes";
	}
};

const mapItems = (value: string) => {
	const {
		left,
		link,
		right,
	}: {
		left: StepHandActionData[];
		link: StepLinkActionData[];
		right: StepHandActionData[];
	} = JSON.parse(value);

	const leftItems = left.filter(
		(i) => !i.id.toString().includes("-collapsed-")
	);
	const linkItems = link.filter((i) => !i.collapsed);
	const rightItems = right.filter(
		(i) => !i.id.toString().includes("-collapsed-")
	);

	const actions: StepActionData[] = [];

	leftItems.forEach((leftItem, index) => {
		const linkItem = linkItems[index];
		const rightItem = rightItems[index];
		const action: StepActionData = {
			LHActionID: leftItem.ActionID,
			LHComment: leftItem.Comment,
			LHQuantity: leftItem.Quantity,
			RHActionID: rightItem.ActionID,
			RHComment: rightItem.Comment,
			RHQuantity: rightItem.Quantity,
			SimoLinkPrev: linkItem.SimoLinkPrev,
		};

		actions.push(action);
	});

	return actions;
};
