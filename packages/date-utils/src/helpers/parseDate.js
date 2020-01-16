const moment = require("moment");

export default (d, format = null) => {
	if (d === undefined || d === null || d instanceof Array) {
		return null;
	}

	if (d instanceof Date) {
		return isNaN(d.valueOf()) ? null : d;
	}

	const date = format ? moment(d, format, true) : moment(d);

	return !date.isValid() || date.format() === "Invalid date" ? null : date.toDate();
};
