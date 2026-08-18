import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useReducer,
} from "react";
import { STORAGE_KEYS } from "../constants.common/storageKeys";
import { useLocalStorage } from "../hooks.common/useStorage";

interface ThemeContextState {
	useDarkTheme: boolean;
}

const initialValue: ThemeContextState = {
	useDarkTheme: true,
};

type TC = [
	ThemeContextState,
	() => void | Dispatch<SetStateAction<ThemeContextState>>
];

const ThemeContext = createContext<TC>([initialValue, () => {}]);

interface ThemeProviderProps {
	children?: ReactNode;
}

const reducer = (state: ThemeContextState) => {
	return { useDarkTheme: !state.useDarkTheme };
};

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
	const [darkTheme, setDarkTheme] = useLocalStorage(
		STORAGE_KEYS.useDarkTheme,
		initialValue
	);
	const [state, dispatch] = useReducer(reducer, darkTheme ?? initialValue);

	useEffect(() => {
		setDarkTheme(state);

		if (state.useDarkTheme) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	});

	return (
		<ThemeContext.Provider value={[state, dispatch]} {...props}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
