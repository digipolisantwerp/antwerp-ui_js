const moment = require("moment");

export default (d, format = null, strict = false) => {
	if (d === undefined || d === null || d instanceof Array) {
		return null;
	}

	if (d instanceof Date) {
		return isNaN(d.valueOf()) ? null : d;
	}

	const date = format ? moment.utc(d, format, strict) : moment.utc(d);

	return date.isValid() ? date.toDate() : null;
};
