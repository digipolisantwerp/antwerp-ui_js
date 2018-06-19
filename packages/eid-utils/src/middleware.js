// ESLint comment to allow "IntoitCardReaderApiFactory" as a global.
/*globals IntoitCardReaderApiFactory:false*/

import { StatusCodes, API } from "./constants/index";
import { CardReaderMonitor } from "./cardreaderMonitor";

export class Middleware {
	constructor() {
		this.cardreader = IntoitCardReaderApiFactory.getMiddlewareApi();
		this.cardreaderMonitor = null;
	}

	initialize() {
		return new Promise((resolve, reject) => {
			this.cardreader
				.checkStatus()
				.then((statusInfo) => {
					if (statusInfo.code === StatusCodes.OK) {
						this.cardreaderMonitor = new CardReaderMonitor(this.cardreader);
						resolve(statusInfo);
					} else {
						reject(statusInfo);
					}
				}, (error) => {
					reject(error);
				});
		});
	}

	static isBrowserCompatible() {
		const compatibleApis = IntoitCardReaderApiFactory.getCompatibleApiNames();

		return !!~compatibleApis.indexOf(API.MIDDLEWARE);
	}

	onEvent(eventCode, callback) {
		this.cardreaderMonitor.on(eventCode, callback);
	}

	waitForStatus(statusCode) {
		return new Promise((resolve) => {
			this.cardreader
				.waitForStatus(statusCode)
				.done(() => {
					resolve(statusCode);
				});
		});
	}
}
