import { RouteObject } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/common/loader/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const Refresh = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const refreshed = useRef(false);

	useEffect(() => {
		if (!refreshed.current) {
			refreshed.current = true;
			queryClient.clear();
			navigate(-1);
		}
	}, []);

	return <Loader />;
};

export const refreshRoute: RouteObject = {
	path: "refresh",
	element: <Refresh />,
};
