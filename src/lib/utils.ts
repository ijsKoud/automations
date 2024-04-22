/**
 * Get the date range for the current week
 * @param startDate The start date of the week
 * @returns
 */
export function getDateRange(startDate?: Date) {
	const currentDate = new Date(startDate ?? new Date());
	const dayOfWeek = currentDate.getDay();

	// If it's Sunday, we want to get the previous week
	if (dayOfWeek === 0) currentDate.setDate(currentDate.getDate() - 7);

	const start = new Date(currentDate);
	start.setDate(currentDate.getDate() - dayOfWeek + 1);

	const end = new Date(currentDate);
	end.setDate(currentDate.getDate() + 7 - dayOfWeek + 1);

	return { start, end };
}
