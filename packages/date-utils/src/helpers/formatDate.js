import { DEFAULT_FORMATTING_OPTIONS } from "../formatting.const";
import parseDate from "./parseDate";
import addLeadingZero from "./addLeadingZero";
import getWeekday from "./getWeekday";

export default (dateString, format = "", options = {}) => {
	const date = parseDate(dateString);

	if (!date) {
		return null;
	}

	const formattingOptions = { ...DEFAULT_FORMATTING_OPTIONS, ...options };
	const formats = {
		YY: d => addLeadingZero(String(d.getFullYear()).substr(2), formattingOptions.leadingZero),
		YYYY: d => addLeadingZero(d.getFullYear(), formattingOptions.leadingZero),
		MM: d => addLeadingZero(d.getMonth() + 1, formattingOptions.leadingZero),
		MMMM: d => addLeadingZero(formattingOptions.monthLabels[d.getMonth()], formattingOptions.leadingZero),
		DD: d => addLeadingZero(d.getDate(), formattingOptions.leadingZero),
		DDDD: d => addLeadingZero(formattingOptions.weekdayLabels[getWeekday(d, options.startOfWeek)], formattingOptions.leadingZero),
		hh: d => addLeadingZero(d.getHours(), formattingOptions.leadingZero),
		mm: d => addLeadingZero(d.getMinutes(), formattingOptions.leadingZero),
		ss: d => addLeadingZero(d.getSeconds(), formattingOptions.leadingZero),
		ms: d => addLeadingZero(d.getMilliseconds(), formattingOptions.leadingZero),
	};

	return format
		.split(/[^YMDhms]/)
		.reduce((acc, curr) => {
			return formats.hasOwnProperty(curr) ? acc.replace(curr, formats[curr](date)) : acc;
		}, format);
};
