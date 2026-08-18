import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../common/avatar/Avatar";
import { ApprovalStatus } from "../common/status/approval/ApprovalStatus";
import { Table } from "./Table";

const meta: Meta<typeof Table> = {
	title: "Components/Table",
	component: Table,
};

export default meta;

type Story = StoryObj<typeof meta>;

const TableData = [
	{
		ID: 7395,
		Code: "ARISE",
		Description: "Arise",
		SecsAt100: 0.96,
		System: true,
		ReflectLevel: true,
		Status: 0,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7396,
		Code: "BEND",
		Description: "Bend",
		SecsAt100: 0.87,
		System: true,
		ReflectLevel: true,
		Status: 1,
		image: "",
	},
	{
		ID: 7397,
		Code: "DWELL",
		Description: "Machine time (1/100th second)",
		SecsAt100: 0.01,
		System: true,
		ReflectLevel: false,
		Status: 2,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7398,
		Code: "FOCUS",
		Description: "Focus eye",
		SecsAt100: 0.21,
		System: false,
		ReflectLevel: true,
		Status: 1,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7399,
		Code: "FOOT",
		Description: "Foot movement",
		SecsAt100: 0.27,
		System: true,
		ReflectLevel: true,
		Status: 0,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7400,
		Code: "FORCA",
		Description: "Force applied (3kg)",
		SecsAt100: 0.03,
		System: true,
		ReflectLevel: true,
		Status: 0,
		image: "",
	},
	{
		ID: 7401,
		Code: "FORCR",
		Description: "Force released (6kg)",
		SecsAt100: 0.03,
		System: true,
		ReflectLevel: true,
		Status: 1,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7402,
		Code: "G",
		Description: "Grasp",
		SecsAt100: 0.205,
		System: true,
		ReflectLevel: true,
		Status: 2,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7403,
		Code: "GD",
		Description: "Difficult grasp",
		SecsAt100: 0.415,
		System: false,
		ReflectLevel: true,
		Status: 1,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7404,
		Code: "GE",
		Description: "Easy grasp",
		SecsAt100: 0.095,
		System: false,
		ReflectLevel: true,
		Status: 0,
		image: "",
	},
	{
		ID: 7405,
		Code: "KNEE",
		Description: "Knee movement",
		SecsAt100: 0.09,
		System: true,
		ReflectLevel: true,
		Status: 2,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7406,
		Code: "LOADD",
		Description: "Put down load (6kg)",
		SecsAt100: 0.03,
		System: true,
		ReflectLevel: true,
		Status: 2,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7407,
		Code: "LOADU",
		Description: "Pick up load (3kg)",
		SecsAt100: 0.03,
		System: false,
		ReflectLevel: true,
		Status: 1,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7408,
		Code: "MOVE",
		Description: "Movement (per cm)",
		SecsAt100: 0.008,
		System: true,
		ReflectLevel: true,
		Status: 0,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7409,
		Code: "MOVE2",
		Description: "Movement (per cm) (x 2 slower)",
		SecsAt100: 0.016,
		System: true,
		ReflectLevel: true,
		Status: 1,
		image: "",
	},
	{
		ID: 7410,
		Code: "MOVE4",
		Description: "Movement (per cm) (x 4 slower)",
		SecsAt100: 0.032,
		System: true,
		ReflectLevel: true,
		Status: 0,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
	{
		ID: 7411,
		Code: "MOVE8",
		Description: "Movement (per cm) (x 8 slower)",
		SecsAt100: 0.064,
		System: true,
		ReflectLevel: true,
		Status: 2,
		image: "https://freepngimg.com/thumb/categories/627.png",
	},
];

export const Default: Story = {
	args: {
		columns: [
			{ label: "Description", accessor: "Description" },
			{ label: "Code", accessor: "Code" },
			{ label: "Seconds", accessor: "SecsAt100" },
			{ label: "System", accessor: "System" },
		],
		data: TableData,
	},
};

export const SortingOptional: Story = {
	args: {
		columns: [
			{ label: "Description", accessor: "Description", sortable: true },
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
			{ label: "System", accessor: "System", sortable: false },
		],
		data: TableData,
	},
};

export const SortingDefault: Story = {
	args: {
		columns: [
			{
				label: "Description",
				accessor: "Description",
				sortable: true,
				sortOrder: "desc",
			},
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
			{ label: "System", accessor: "System", sortable: true },
		],
		data: TableData,
	},
};

export const ColumnAlignment: Story = {
	args: {
		columns: [
			{
				label: "Description",
				accessor: "Description",
				sortable: true,
				alignHorizontal: "left",
			},
			{
				label: "Code",
				accessor: "Code",
				sortable: true,
				alignHorizontal: "center",
			},
			{
				label: "Seconds",
				accessor: "SecsAt100",
				sortable: true,
				alignHorizontal: "center",
			},
			{
				label: "System",
				accessor: "System",
				sortable: true,
				alignHorizontal: "right",
			},
		],
		data: TableData,
	},
};

export const ColumnWidths: Story = {
	args: {
		columns: [
			{ label: "Description", accessor: "Description", sortable: true, width: "25%" },
			{ label: "Code", accessor: "Code", sortable: true, width: "25%" },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true, width: "25%" },
			{ label: "System", accessor: "System", sortable: true, width: "25%" },
		],
		data: TableData,
	},
};

export const ColumnSpanning: Story = {
	args: {
		columns: [
			{ label: "Description", accessor: "Description", sortable: true },
			{ label: "Code and Seconds", accessor: "Code", span: 2, width: 1 },
			{ accessor: "SecsAt100", span: 0 },
		],
		data: TableData,
	},
};

export const MissingValues: Story = {
	args: {
		columns: [
			{ label: "Description", accessor: "Description", sortable: true },
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
			{ label: "Missing", accessor: "Missing", sortable: true },
		],
		data: [
			{
				ID: 7392,
				Code: "ARISE",
				Description: "Arise",
				SecsAt100: null,
				System: true,
				ReflectLevel: true,
				Status: 0,
			},
			{
				ID: 7393,
				Code: "ARISE",
				SecsAt100: 0.96,
				System: true,
				ReflectLevel: true,
				Status: 0,
			},
			{
				ID: 7394,
				Description: "Arise",
				SecsAt100: 0.96,
				System: true,
				ReflectLevel: true,
				Status: 0,
			},
			...TableData,
		] as typeof TableData,
	},
};

export const Templates: Story = {
	args: {
		columns: [
			{
				label: "Description",
				accessor: "Description",
				sortable: true,
				template: <div className="text-h3"></div>,
			},
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
			{ label: "System", accessor: "System", sortable: false },
		],
		data: TableData,
	},
};

export const Avatars: Story = {
	args: {
		columns: [
			{
				template: (data) => (
					<Avatar
						size="sm"
						src={(data as typeof TableData[0]).image as string}
					/>
				),
				span: 0,
				width: 1,
			},
			{ label: "Description", accessor: "Description", sortable: true, span: 2 },
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
		],
		data: TableData,
	},
};

export const Status: Story = {
	args: {
		columns: [
			{ label: "Description", accessor: "Description", sortable: true },
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
			{
				label: "Status",
				accessor: "Status",
				sortable: true,
				template: (data) => (
					<ApprovalStatus
						{...{
							status: (data as typeof TableData[0]).Status as number,
						}}
					/>
				),
			},
		],
		data: TableData,
	},
};

export const RowLinks: Story = {
	args: {
		columns: [
			{ label: "Description", accessor: "Description", sortable: true },
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
			{ label: "System", accessor: "System", sortable: false },
		],
		data: TableData,
		rows: {
			link: { label: "View Detail", url: "/example" },
		},
	},
};

export const RowBorders: Story = {
	args: {
		columns: [
			{ label: "Description", accessor: "Description", sortable: true },
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
			{ label: "System", accessor: "System", sortable: false },
		],
		data: TableData,
		rows: {
			link: { label: "View Detail", url: "/example" },
		},
		tableClassName: "table--border",
	},
};

const actionsMenu = {
	menu: [
		{ label: "Link example", url: "/example" },
		{
			label: "Method example",
			method: () => {
				alert("Button clicked");
			},
		},
		{
			step: (
				<button
					type="button"
					onClick={() => {
						alert("Step clicked");
					}}
				>
					Step example
				</button>
			),
		},
	],
};

export const ActionsMenu: Story = {
	args: {
		actions: actionsMenu,
		columns: [
			{ label: "Description", accessor: "Description", sortable: true },
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
			{ label: "System", accessor: "System", sortable: false },
		],
		data: TableData,
		rows: {
			link: { label: "View Detail", url: "/example" },
		},
		tableClassName: "table--border",
	},
};

export const Pagination: Story = {
	args: {
		actions: actionsMenu,
		columns: [
			{ label: "Description", accessor: "Description", sortable: true },
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
			{ label: "System", accessor: "System", sortable: false },
		],
		data: [
			{
				ID: 7412,
				Code: "ARISE",
				Description: "Arise",
				SecsAt100: 0.96,
				System: true,
				ReflectLevel: true,
				Status: 0,
				image: "https://freepngimg.com/thumb/categories/627.png",
			},
			{
				ID: 7413,
				Code: "BEND",
				Description: "Bend",
				SecsAt100: 0.87,
				System: true,
				ReflectLevel: true,
				Status: 1,
				image: "",
			},
			{
				ID: 7414,
				Code: "DWELL",
				Description: "Machine time (1/100th second)",
				SecsAt100: 0.01,
				System: true,
				ReflectLevel: false,
				Status: 2,
				image: "https://freepngimg.com/thumb/categories/627.png",
			},
			{
				ID: 7415,
				Code: "FOCUS",
				Description: "Focus eye",
				SecsAt100: 0.21,
				System: false,
				ReflectLevel: true,
				Status: 1,
				image: "https://freepngimg.com/thumb/categories/627.png",
			},
			{
				ID: 7416,
				Code: "FOOT",
				Description: "Foot movement",
				SecsAt100: 0.27,
				System: true,
				ReflectLevel: true,
				Status: 0,
				image: "https://freepngimg.com/thumb/categories/627.png",
			},
			{
				ID: 7417,
				Code: "FORCA",
				Description: "Force applied (3kg)",
				SecsAt100: 0.03,
				System: true,
				ReflectLevel: true,
				Status: 0,
				image: "",
			},
			{
				ID: 7401,
				Code: "FORCR",
				Description: "Force released (6kg)",
				SecsAt100: 0.03,
				System: true,
				ReflectLevel: true,
				Status: 1,
				image: "https://freepngimg.com/thumb/categories/627.png",
			},
			...TableData,
		],
		rows: {
			link: { label: "View Detail", url: "/example" },
		},
		tableClassName: "table--border",
	},
};

export const DragAndDrop: Story = {
	args: {
		actions: actionsMenu,
		columns: [
			{ label: "Description", accessor: "Description", sortable: true },
			{ label: "Code", accessor: "Code", sortable: true },
			{ label: "Seconds", accessor: "SecsAt100", sortable: true },
			{ label: "System", accessor: "System", sortable: false },
		],
		data: TableData,
		rows: {
			draggable: true,
		},
	},
};

export const PreHeading: Story = {
	args: {
		columns: [
			{ label: "Description", accessor: "Description" },
			{ label: "Code", accessor: "Code" },
			{ label: "Seconds", accessor: "SecsAt100" },
			{ label: "System", accessor: "System" },
		],
		data: TableData,
		preHeading: (
			<tr>
				<th className="table__pre-heading" colSpan={2}>
					Pre Header
				</th>
				<th className="table__pre-heading" colSpan={2}>
					Pre Header
				</th>
			</tr>
		),
	},
};
