import { UniqueIdentifier } from "@dnd-kit/core";
import { AnimatePresence } from "framer-motion";
import { createContext, ReactNode, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResponseData } from "../api.common/types";
import { Toast } from "../components/common/toast/Toast";
import { toCamelCase } from "../utilities.common/StringUtilities";

export type NotificationProps = {
	id?: UniqueIdentifier;
	dismissDisabled?: boolean;
	duration?: number;
	heading?: string;
	message: ReactNode;
	type?: "info" | "error" | "success";
};

type NotificationContext = {
	addNotification: (notification: NotificationProps) => void;
	notificationExists: (id: UniqueIdentifier) => boolean;
	notifications: NotificationProps[];
	removeNotification: (id: UniqueIdentifier) => void;
	processResponse: (error: ResponseData) => void;
};

export const NotificationContext = createContext<NotificationContext>({
	addNotification: () => {},
	notificationExists: () => false,
	notifications: [],
	removeNotification: () => {},
	processResponse: () => {},
});

interface NotificationProviderProps {
	children?: ReactNode;
}

export const NotificationProvider = ({
	children,
	...props
}: NotificationProviderProps) => {
	const [notifications, setNotifications] = useState<NotificationProps[]>([]);
	const notificationsRef = useRef<NotificationProps[]>([]);
	const [counter, setCounter] = useState<number>(0);

	const { t } = useTranslation();

	const removeNotification = (id: UniqueIdentifier) => {
		notificationsRef.current = notificationsRef.current.filter(
			(item) =>
				item.id?.toString().toLowerCase() !==
				id.toString().toLowerCase()
		);
		setNotifications(notificationsRef.current);
	};

	const notificationExists = (id: UniqueIdentifier) =>
		notificationsRef.current.find(
			(n) =>
				n.id?.toString().toLowerCase() === id.toString().toLowerCase()
		) !== undefined;

	const addNotification = (notification: NotificationProps) => {
		const id = notification.id || counter + 1;

		if (notificationExists(id)) {
			return;
		}

		if (!notification.id) {
			setCounter(id as number);
		}

		notificationsRef.current.push({ ...notification, id: id });
		setNotifications(notificationsRef.current);
	};

	const processResponse = ({
		code,
		message,
		responseMessage,
	}: ResponseData) => {
		let type: NotificationProps["type"];

		switch (responseMessage?.Type) {
			case "etError":
				type = "error";
				break;
			case "etWarning":
			case "etInfo":
				type = "info";
				break;
			default:
				type = "error";
				break;
		}

		addNotification({
			heading:
				type === "error" && (code || message)
					? `${code ?? ""}${code && message ? " - " : ""}${
							message ?? ""
					  }`
					: undefined,
			message: responseMessage?.Reason ? (
				<>
					<p>
						{`${t(
							toCamelCase(responseMessage.Reason),
							responseMessage.Reason
						).replace("%s", responseMessage.Detail ?? "")}`}
					</p>
					{responseMessage.Info ? (
						<p className="mt-4">{responseMessage.Info}</p>
					) : (
						<></>
					)}
				</>
			) : (
				message ?? "error"
			),
			type: type,
		});
	};

	return (
		<NotificationContext.Provider
			value={{
				addNotification,
				notificationExists,
				removeNotification,
				notifications,
				processResponse,
			}}
			{...props}
		>
			<>
				{children}
				<AnimatePresence>
					{notifications.map((notification) => (
						<Toast
							key={notification.id}
							notification={notification}
						/>
					))}
				</AnimatePresence>
			</>
		</NotificationContext.Provider>
	);
};
