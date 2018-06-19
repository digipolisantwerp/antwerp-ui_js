function defer(resolve, reject, payload) {
	if (payload.error != null) {
		reject(payload.error);
		return;
	}
	resolve(payload.data);
}

function readNonRepudiationCertificate(instance) {
	return new Promise((resolve, reject) => {
		instance.readNonRepudiationCertificate((data, error) => {
			defer(resolve, reject, { data, error });
		});
	});
}

function readAuthenticationCertificate(instance) {
	return new Promise((resolve, reject) => {
		instance.readAuthenticationCertificate((data, error) => {
			defer(resolve, reject, { data, error });
		});
	});
}

function readRnCertificate(instance) {
	return new Promise((resolve, reject) => {
		instance.readRnCertificate((data, error) => {
			defer(resolve, reject, { data, error });
		});
	});
}

function readRawAddressData(instance) {
	return new Promise((resolve, reject) => {
		instance.readRawAddressData((data, error) => {
			defer(resolve, reject, { data: data, error: error });
		});
	});
}

function readAddressDataSignature(instance) {
	return new Promise((resolve, reject) => {
		instance.readAddressDataSignature((data, error) => {
			defer(resolve, reject, { data: data, error: error });
		});
	});
}

function readRawRnData(instance) {
	return new Promise((resolve, reject) => {
		instance.readRawRnData((data, error) => {
			defer(resolve, reject, { data: data, error: error });
		});
	});
}

function readRnDataSignature(instance) {
	return new Promise((resolve, reject) => {
		instance.readRnDataSignature((data, error) => {
			defer(resolve, reject, { data: data, error: error });
		});
	});
}

function readCitizenCertificate(instance) {
	return new Promise((resolve, reject) => {
		instance.readCitizenCertificate((data, error) => {
			defer(resolve, reject, { data: data, error: error });
		});
	});
}

let cardInstance = null;

export class EidCard {
	constructor(eIdCardInstance) {
		cardInstance = eIdCardInstance;
	}

	readValidationData() {
		return new Promise((resolve, reject) => {
			return Promise.all([
				readAuthenticationCertificate(cardInstance),
				readNonRepudiationCertificate(cardInstance),
				readRnCertificate(cardInstance),
				readRawAddressData(cardInstance),
				readAddressDataSignature(cardInstance),
				readRawRnData(cardInstance),
				readRnDataSignature(cardInstance),
				readCitizenCertificate(cardInstance)
			]).then(([
				authCer,
				nonRepudCer,
				cer,
				rawAddress,
				addressSignature,
				rawRnData,
				rnDatasignature,
				citizenCer]) => {
				resolve({
					authenticationCertificate: authCer,
					nonRepudiationCertificate: nonRepudCer,
					rnCertificate: cer,
					rawAddressData: rawAddress,
					addressDataSignature: addressSignature,
					rawRnData: rawRnData,
					rnDataSignature: rnDatasignature,
					citizenCertificate: citizenCer
				});
			}, (error) => {
				reject(error);
			});
		});
	}

	signWithAuthenticationToken(token) {
		const self = this;
		return new Promise((resolve, reject) => {
			self.cardInstance.authenticateRsa(token, (signature, error) => {
				self.cardInstance.stopSigningSession();
				defer(resolve, reject, { data: signature, error: error });
			});
		});
	}

	resolveReaderFeatures() {
		return this.cardInstance.cardChannel.cardReader.features;
	}

	setupPinPadRequestFlow(requestCallback, onCorrectPin, onError, onTriesLeftUpdated) {
		this.cardInstance.pinCapability.securePinEntryMessageDelegate = {
			enterPinOnPinPad: requestCallback,
			correctPin: onCorrectPin,
			onError: onError,
			setPinTriesLeft: onTriesLeftUpdated
		};
	}

	setupPinRequestFlow(requestCallback, onCorrectPin, onError, onTriesLeftUpdated) {
		this.cardInstance.setPinDelegate({
			getPin: requestCallback,
			correctPin: onCorrectPin,
			onError: onError,
			setPinTriesLeft: onTriesLeftUpdated
		});
	}
}
