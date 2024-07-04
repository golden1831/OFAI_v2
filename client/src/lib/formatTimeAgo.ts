export function formatTimeAgo(timestamp: number) {
	const date = new Date(timestamp);
	const hours = String(date.getHours()).padStart(2, "0"); 
	const minutes = String(date.getMinutes()).padStart(2, "0");
	
	return `${hours}:${minutes}`; 
}