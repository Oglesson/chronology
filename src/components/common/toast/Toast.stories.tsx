import type { Meta, StoryObj } from "@storybook/react";
import { useContext, useEffect } from "react";
import { NotificationContext } from "../../../context.common/NotificationContext";
import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = {
	title: "Components/Toast",
	component: Toast,
};

export default meta;

type Story = StoryObj<typeof meta>;

const DefaultRender: Story["render"] = (args) => {
	const { addNotification } = useContext(NotificationContext);

	useEffect(() => {
		addNotification(args.notification);
	}, []);

	return <></>;
};

export const Info: Story = {
	render: DefaultRender,
	args: {
		notification: {
			duration: 5000,
			heading: "Notification heading",
			message:
				"I am an info notification, I will automatically disappear in 5 seconds.",
			type: "info",
		},
	},
};

export const Error: Story = {
	render: DefaultRender,
	args: {
		notification: {
			duration: 5000,
			heading: "Error heading",
			message:
				"I am an error notification, I will automatically disappear in 5 seconds.",
			type: "error",
		},
	},
};

export const Success: Story = {
	render: DefaultRender,
	args: {
		notification: {
			duration: 5000,
			heading: "Success heading",
			message:
				"I am a success notification, I will automatically disappear in 5 seconds.",
			type: "success",
		},
	},
};

export const Persistent: Story = {
	render: DefaultRender,
	args: {
		notification: {
			duration: 0,
			heading: "Error heading",
			message:
				"I am a an example notification, you will have to manually close me.",
			type: "error",
		},
	},
};

export const HTML: Story = {
	render: DefaultRender,
	args: {
		notification: {
			duration: 0,
			heading: "Error heading",
			message: (
				<p>
					An error occured please try again, if this error persists please{" "}
					<a className="underline" href="#" target="_blank">
						let us know
					</a>
					.
				</p>
			),
			type: "error",
		},
	},
};

const RandomRender: Story["render"] = () => {
	const { addNotification } = useContext(NotificationContext);

	return (
		<button
			type="button"
			className="interaction:bg-white button button--primary button--default"
			onClick={() => {
				const type =
					Math.random() > 0.66
						? "success"
						: Math.random() > 0.33
						? "error"
						: "info";
				addNotification({
					duration: 5000,
					heading: `${type} notification heading`,
					message:
						"I am a text label that runs here for Toast notifications across multiple lines.",
					type: type,
				});
			}}
		>
			Add notification
		</button>
	);
};

export const Random: Story = {
	render: RandomRender,
};
