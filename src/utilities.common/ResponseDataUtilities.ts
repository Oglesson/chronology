import { ResponseData } from "../api.common/types";

export default class ResponseDataUtilities {
	// Clears all fields on a ResponseData object, typically before issuing a new request
	public static resetResponseData = (responseData: ResponseData): void => {
		if (!responseData) return;

		responseData.code = undefined;
		responseData.message = undefined;
		responseData.type = undefined;
		responseData.responseMessage = undefined;
	};
}
