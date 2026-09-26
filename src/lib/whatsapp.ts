export function buildWhatsAppUrl(phone: string, message: string): string {
	const digits = phone.replace(/\D/g, "");
	const text = encodeURIComponent(message);
	return `https://wa.me/${digits}?text=${text}`;
}
