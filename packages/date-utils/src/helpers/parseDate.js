export default (d) => {
	if (d instanceof Date) {
		return isNaN(d.valueOf()) ? null : d;
	}

	return isNaN(Date.parse(d)) ? null : new Date(d);
};
