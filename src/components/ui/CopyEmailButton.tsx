import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/cn";

type CopyEmailButtonProps = {
	email: string;
	copyLabel: string;
	copiedLabel: string;
};

export function CopyEmailButton({
	email,
	copyLabel,
	copiedLabel,
}: CopyEmailButtonProps) {
	const [copied, setCopied] = useState(false);

	const onCopy = async () => {
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			/* clipboard unavailable */
		}
	};

	return (
		<button
			type="button"
			onClick={onCopy}
			className={cn(
				"inline-flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-5 py-3 text-sm text-accent transition hover:border-accent/50 hover:shadow-[0_0_20px_var(--color-glow)]",
			)}
		>
			{copied ? (
				<Check className="h-4 w-4" aria-hidden />
			) : (
				<Copy className="h-4 w-4" aria-hidden />
			)}
			{copied ? copiedLabel : copyLabel}
		</button>
	);
}
