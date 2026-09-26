import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
import { useRef } from "react";
import type { Project, SiteConfig } from "../../types/site";
import { StackIcons } from "../ui/StackIcons";

gsap.registerPlugin(ScrollTrigger);

type SelectedWorkProps = {
	config: SiteConfig;
	projects: Project[];
};

export function SelectedWork({ config, projects }: SelectedWorkProps) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const section = sectionRef.current;
			if (!section) return;

			const cards = gsap.utils.toArray<HTMLElement>(".project-card", section);
			if (!cards.length) return;

			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				gsap.set(cards, { opacity: 1, y: 0 });
				return;
			}

			const tween = gsap.fromTo(
				cards,
				{ opacity: 0, y: 40 },
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					stagger: 0.15,
					ease: "power2.out",
					immediateRender: false,
					scrollTrigger: {
						trigger: section,
						start: "top 85%",
						once: true,
						toggleActions: "play none none none",
					},
					onComplete: () => {
						gsap.set(cards, { clearProps: "opacity,transform" });
					},
				},
			);

			return () => {
				tween.scrollTrigger?.kill();
				tween.kill();
			};
		},
		{ scope: sectionRef, dependencies: [projects] },
	);

	return (
		<section ref={sectionRef} id="work" className="py-16 md:py-20">
			<div className="page-container">
				<h2 className="mb-10 text-2xl font-bold md:text-3xl">
					{config.sections.selectedWork}
				</h2>
				<div className="grid gap-6 md:grid-cols-2">
					{projects.map((project) => (
						<article
							key={project.id}
							className="project-card group rounded-2xl border border-border bg-bg-elevated/50 p-6 transition hover:border-accent/40 hover:shadow-[0_0_30px_var(--color-glow)]"
						>
							<div className="mb-3 flex flex-wrap items-start justify-between gap-2">
								<h3 className="text-xl font-semibold">{project.title}</h3>
								{project.badge && (
									<span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
										{project.badge}
									</span>
								)}
							</div>
							<p className="mb-3 text-sm text-accent">{project.role}</p>
							<div className="mb-4">
								<StackIcons stack={project.stack} />
							</div>
							<p className="mb-4 text-sm leading-relaxed text-muted">
								{project.description}
							</p>
							{project.url && (
								<a
									href={project.url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
								>
									{config.cta.viewLive}
									<ExternalLink className="h-4 w-4" aria-hidden="true" />
								</a>
							)}
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
