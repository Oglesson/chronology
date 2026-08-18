import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue?: T) => {
	return useStorage("local", key, initialValue);
};

export const useSessionStorage = <T>(key: string, initialValue?: T) => {
	return useStorage("session", key, initialValue);
};

const getSavedValue = <T>(
	storageType: "local" | "session",
	key: string,
	initialValue?: T
) => {
	let item;

	switch (storageType) {
		case "local":
			item = localStorage.getItem(key);
			break;
		case "session":
			item = sessionStorage.getItem(key);
			break;
		default:
			return initialValue;
	}

	if (item && item !== "undefined") {
		return JSON.parse(item);
	}

	if (initialValue instanceof Function) {
		return initialValue();
	}

	return initialValue;
};

const useStorage = <T>(
	storageType: "local" | "session",
	key: string,
	initialValue?: T
): [T, Dispatch<SetStateAction<T>>, () => void] => {
	const [value, setValue] = useState(() => {
		return getSavedValue(storageType, key, initialValue);
	});

	useEffect(() => {
		switch (storageType) {
			case "local":
				localStorage.setItem(key, JSON.stringify(value));
				break;
			case "session":
				sessionStorage.setItem(key, JSON.stringify(value));
				break;
			default:
				break;
		}
	}, [value]);

	const removeValue = useCallback(() => {
		setValue(undefined);
	}, []);

	return [value, setValue, removeValue];
};
