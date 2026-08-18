import { useState } from "react";

export const useRerender = () => {
	const rerender = useState<object>({})[1];

	return rerender;
};
