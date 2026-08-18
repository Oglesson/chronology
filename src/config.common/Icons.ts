export class Icon {
	path: string;

	constructor(path: string) {
		this.path = path;
	}
}

class IconsClass {
	Edit: EditIcons;
	Interface: InterfaceIcons;
	Logo: LogoIcons;
	Menu: MenuIcons;

	constructor() {
		this.Edit = {
			Copy: new Icon(this.#getSvgPath("edit", "copy")),
			Delete: new Icon(this.#getSvgPath("edit", "delete")),
			Hide: new Icon(this.#getSvgPath("edit", "hide")),
			Minus: new Icon(this.#getSvgPath("edit", "minus")),
			Pencil: new Icon(this.#getSvgPath("edit", "pencil")),
			Plus: new Icon(this.#getSvgPath("edit", "plus")),
			PlusSmall: new Icon(this.#getSvgPath("edit", "plus-small")),
			Redo: new Icon(this.#getSvgPath("edit", "redo")),
			Remove: new Icon(this.#getSvgPath("edit", "remove")),
			RemoveSolid: new Icon(this.#getSvgPath("edit", "remove-solid")),
			Show: new Icon(this.#getSvgPath("edit", "show")),
			Undo: new Icon(this.#getSvgPath("edit", "undo")),
		};

		this.Interface = {
			ArrowBack: new Icon(this.#getSvgPath("interface", "arrow-back")),
			ArrowBackSmall: new Icon(
				this.#getSvgPath("interface", "arrow-back-small"),
			),
			ArrowDownBig: new Icon(
				this.#getSvgPath("interface", "arrow-down-big"),
			),
			ArrowDownSmall: new Icon(
				this.#getSvgPath("interface", "arrow-down-small"),
			),
			ArrowLeftBig: new Icon(
				this.#getSvgPath("interface", "arrow-left-big"),
			),
			ArrowLeftSmall: new Icon(
				this.#getSvgPath("interface", "arrow-left-small"),
			),
			ArrowNext: new Icon(this.#getSvgPath("interface", "arrow-next")),
			ArrowNextSmall: new Icon(
				this.#getSvgPath("interface", "arrow-next-small"),
			),
			ArrowRefresh: new Icon(
				this.#getSvgPath("interface", "arrow-refresh"),
			),
			ArrowRightBig: new Icon(
				this.#getSvgPath("interface", "arrow-right-big"),
			),
			ArrowRightSmall: new Icon(
				this.#getSvgPath("interface", "arrow-right-small"),
			),
			ArrowUpSmall: new Icon(
				this.#getSvgPath("interface", "arrow-up-small"),
			),
			BarChart: new Icon(this.#getSvgPath("interface", "bar-chart")),
			Calendar: new Icon(this.#getSvgPath("interface", "calendar")),
			Check: new Icon(this.#getSvgPath("interface", "check")),
			Clock: new Icon(this.#getSvgPath("interface", "clock")),
			Close: new Icon(this.#getSvgPath("interface", "close")),
			CloseSmall: new Icon(this.#getSvgPath("interface", "close-small")),
			CopyLink: new Icon(this.#getSvgPath("interface", "copy-link")),
			Download: new Icon(this.#getSvgPath("interface", "download")),
			Filter: new Icon(this.#getSvgPath("interface", "filter")),
			Frozen: new Icon(this.#getSvgPath("interface", "frozen")),
			Help: new Icon(this.#getSvgPath("interface", "help")),
			Info: new Icon(this.#getSvgPath("interface", "info")),
			List: new Icon(this.#getSvgPath("interface", "list")),
			Loading: new Icon(this.#getSvgPath("interface", "loading")),
			Media: new Icon(this.#getSvgPath("interface", "media")),
			MoreHorizontal: new Icon(
				this.#getSvgPath("interface", "more-horizontal"),
			),
			MoreVertical: new Icon(
				this.#getSvgPath("interface", "more-vertical"),
			),
			NotficationDot: new Icon(
				this.#getSvgPath("interface", "notfication-dot"),
			),
			NotificationMain: new Icon(
				this.#getSvgPath("interface", "notification-main"),
			),
			PieChart: new Icon(this.#getSvgPath("interface", "pie-chart")),
			Linked: new Icon(this.#getSvgPath("interface", "linked")),
			Search: new Icon(this.#getSvgPath("interface", "search")),
			Tick: new Icon(this.#getSvgPath("interface", "tick")),
			TrendingDown: new Icon(
				this.#getSvgPath("interface", "trending-down"),
			),
			TrendingUp: new Icon(this.#getSvgPath("interface", "trending-up")),
			Warning: new Icon(this.#getSvgPath("interface", "warning")),
		};
		this.Logo = {
			ChronologyBlack: new Icon(
				this.#getSvgPath("logos", "chronology-black"),
			),
			ChronologyNoText: new Icon(
				this.#getSvgPath("logos", "chronology-no-text"),
			),
			ChronologyWhite: new Icon(
				this.#getSvgPath("logos", "chronology-white"),
			),
		};
		this.Menu = {
			Burger: new Icon(this.#getSvgPath("menu", "burger")),
			Costings: new Icon(this.#getSvgPath("menu", "costings")),
			DarkMode: new Icon(this.#getSvgPath("menu", "dark-mode")),
			LightMode: new Icon(this.#getSvgPath("menu", "light-mode")),
			Lines: new Icon(this.#getSvgPath("menu", "lines")),
			Projects: new Icon(this.#getSvgPath("menu", "projects")),
			Workspace: new Icon(this.#getSvgPath("menu", "workspace")),
		};
	}

	#getSvgPath = (category: string, name: string) => {
		return `/icons/${category}/${name}.svg`;
	};
}

const Icons = new IconsClass();

export default Icons;

interface EditIcons {
	Copy: Icon;
	Delete: Icon;
	Hide: Icon;
	Minus: Icon;
	Pencil: Icon;
	Plus: Icon;
	PlusSmall: Icon;
	Redo: Icon;
	Remove: Icon;
	RemoveSolid: Icon;
	Show: Icon;
	Undo: Icon;
}

interface InterfaceIcons {
	ArrowBack: Icon;
	ArrowBackSmall: Icon;
	ArrowDownBig: Icon;
	ArrowDownSmall: Icon;
	ArrowLeftBig: Icon;
	ArrowLeftSmall: Icon;
	ArrowNext: Icon;
	ArrowNextSmall: Icon;
	ArrowRefresh: Icon;
	ArrowRightBig: Icon;
	ArrowRightSmall: Icon;
	ArrowUpSmall: Icon;
	BarChart: Icon;
	Calendar: Icon;
	Check: Icon;
	Clock: Icon;
	Close: Icon;
	CloseSmall: Icon;
	CopyLink: Icon;
	Download: Icon;
	Filter: Icon;
	Frozen: Icon;
	Help: Icon;
	Info: Icon;
	List: Icon;
	Loading: Icon;
	Media: Icon;
	MoreHorizontal: Icon;
	MoreVertical: Icon;
	NotficationDot: Icon;
	NotificationMain: Icon;
	PieChart: Icon;
	Linked: Icon;
	Search: Icon;
	Tick: Icon;
	TrendingDown: Icon;
	TrendingUp: Icon;
	Warning: Icon;
}

interface LogoIcons {
	ChronologyBlack: Icon;
	ChronologyNoText: Icon;
	ChronologyWhite: Icon;
}

interface MenuIcons {
	Burger: Icon;
	Costings: Icon;
	DarkMode: Icon;
	LightMode: Icon;
	Lines: Icon;
	Projects: Icon;
	Workspace: Icon;
}
