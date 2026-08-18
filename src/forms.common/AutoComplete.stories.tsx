import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "../main.scss";
import { AutoComplete } from "./AutoComplete";

export default {
	title: "Components/Auto Complete",
	component: AutoComplete,
} as ComponentMeta<typeof AutoComplete>;

const actions = [
	{
		ID: 9001,
		Code: "ARISE",
		Description: "Arise",
		SecsAt100: 0.96,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9002,
		Code: "BEND",
		Description: "Bend",
		SecsAt100: 0.87,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9003,
		Code: "DWELL",
		Description: "Machine time (1/100th second)",
		SecsAt100: 0.01,
		System: true,
		ReflectLevel: false,
	},
	{
		ID: 9004,
		Code: "FOCUS",
		Description: "Focus eye",
		SecsAt100: 0.21,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9005,
		Code: "FOOT",
		Description: "Foot movement",
		SecsAt100: 0.27,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9006,
		Code: "FORCA",
		Description: "Force applied (3kg)",
		SecsAt100: 0.03,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9007,
		Code: "FORCR",
		Description: "Force released (6kg)",
		SecsAt100: 0.03,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9008,
		Code: "G",
		Description: "Grasp",
		SecsAt100: 0.205,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9009,
		Code: "GD",
		Description: "Difficult grasp",
		SecsAt100: 0.415,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9010,
		Code: "GE",
		Description: "Easy grasp",
		SecsAt100: 0.095,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9011,
		Code: "KNEE",
		Description: "Knee movement",
		SecsAt100: 0.09,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9012,
		Code: "LOADD",
		Description: "Put down load (6kg)",
		SecsAt100: 0.03,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9013,
		Code: "LOADU",
		Description: "Pick up load (3kg)",
		SecsAt100: 0.03,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9014,
		Code: "MOVE",
		Description: "Movement (per cm)",
		SecsAt100: 0.008,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9015,
		Code: "MOVE2",
		Description: "Movement (per cm) (x 2 slower)",
		SecsAt100: 0.016,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9016,
		Code: "MOVE4",
		Description: "Movement (per cm) (x 4 slower)",
		SecsAt100: 0.032,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9017,
		Code: "MOVE8",
		Description: "Movement (per cm) (x 8 slower)",
		SecsAt100: 0.064,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9018,
		Code: "P",
		Description: "Place",
		SecsAt100: 0.425,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9019,
		Code: "PD",
		Description: "Difficult place",
		SecsAt100: 0.595,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9020,
		Code: "PE",
		Description: "Easy place",
		SecsAt100: 0.265,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9021,
		Code: "PRESS",
		Description: "Apply pressure",
		SecsAt100: 0.42,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9022,
		Code: "RGRSP",
		Description: "Regrasp component already held",
		SecsAt100: 0.18,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9023,
		Code: "ROTAT",
		Description: "Rotate component 1 degree",
		SecsAt100: 0.0025,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9024,
		Code: "SIT",
		Description: "Sit down on a seat",
		SecsAt100: 1.05,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9025,
		Code: "STAND",
		Description: "Stand up from seated position",
		SecsAt100: 1.32,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9026,
		Code: "STEP",
		Description: "Step (57cm)",
		SecsAt100: 0.54,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9027,
		Code: "TIME",
		Description: "Operator time (1/100th second)",
		SecsAt100: 0.01,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 9028,
		Code: "TURN",
		Description: "Turn around 90 degrees",
		SecsAt100: 1.08,
		System: true,
		ReflectLevel: true,
	},
	{
		ID: 10031,
		Code: "CODE0",
		Description: "Test description",
		SecsAt100: 2,
		System: false,
		ReflectLevel: false,
	},
];

const Template: ComponentStory<typeof AutoComplete> = (args) => {
	const schema = z.object({
		action: z.preprocess(
			(val) =>
				(val as string)?.length ? JSON.parse(val as string).Code : val,
			z
				.string()
				.min(1, "Selction must contain at least 1 character(s)")
				.max(20, "Selection cannot exceed 20 characters")
		),
	});
	const {
		control,
		formState: { errors },
	} = useForm<{
		action: string;
	}>({
		resolver: zodResolver(schema),
	});

	return (
		<div className="max-w-xs">
			<AutoComplete
				control={control}
				error={errors.action}
				htmlFor="action"
				label="Action"
				name="action"
				options={actions}
				optionLabelKeys={args.optionLabelKeys}
			/>
		</div>
	);
};

export const Single = Template.bind({});
Single.args = {
	optionLabelKeys: "Code",
};
export const Multiple = Template.bind({});
Multiple.args = {
	optionLabelKeys: ["Code", "Description"],
};
