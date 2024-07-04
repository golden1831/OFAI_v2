import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatTime = (date: string) => {
	const messageTime = new Date(date);

	if (isToday(messageTime)) {
		const diffInMinutes = formatDistanceToNow(messageTime, {
			includeSeconds: true,
		});
		if (diffInMinutes.startsWith("less than a minute")) {
			return "Just now";
		} else {
			return format(messageTime, "HH:mm");
		}
	} else if (isYesterday(messageTime)) {
		return "Yesterday";
	} else {
		return format(messageTime, "dd/MM/yyyy at HH:mm");
	}
};

export function shuffleArray<T>(originalArray: T[]): T[] {
	const array = [...originalArray];

	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

export function removeDuplicates<T>(arr: T[]): T[] {
  const seenIds = new Set<number>();
  const filteredArray = [];

  for (const obj of arr) {
		const field = obj as T & { id: number };

    if (!seenIds.has(field.id)) {
      seenIds.add(field.id);
      filteredArray.push(field);
    }
  }

  return filteredArray;
}