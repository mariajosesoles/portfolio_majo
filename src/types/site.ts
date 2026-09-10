export type Locale = "es" | "en";

export type NavItem = {
	id: string;
	label: string;
};

export type ExperienceProduct = {
	name: string;
	description: string;
	role: string;
};

export type Project = {
	id: string;
	title: string;
	role: string;
	description: string;
	stack: string[];
	url?: string;
	badge?: string;
};

export type BuildingProject = {
	name: string;
	description: string;
	status: string;
};

export type SiteConfig = {
	locale: Locale;
	meta: {
		title: string;
		description: string;
		ogTitle: string;
	};
	name: string;
	tagline: string;
	profile: string;
	heroChips: string[];
	nav: NavItem[];
	experience: {
		company: string;
		period: string;
		location: string;
		intro: string;
		products: ExperienceProduct[];
	};
	sections: {
		experience: string;
		selectedWork: string;
		openSource: string;
		building: string;
		about: string;
		contact: string;
	};
	cta: {
		contact: string;
		viewLive: string;
	};
	openSource: {
		title: string;
		role: string;
		description: string;
		stack: string[];
		url?: string;
		pr?: string;
	};
	building: BuildingProject[];
	about: {
		paragraphs: string[];
		languages: string;
	};
	contact: {
		intro: string;
		email: string;
		phone: string;
	};
	links: {
		github: string;
		linkedin: string;
		email: string;
	};
	footer: {
		copyright: string;
	};
};
