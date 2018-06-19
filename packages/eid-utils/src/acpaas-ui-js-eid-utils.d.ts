export declare class EidMiddlewareModule { }

export declare class Middleware {
	static isBrowserCompatible(): boolean;
	initialize(): Promise<any>;
	onEvent(eventCode: string, callback: Function): void;
	waitForStatus(statusCode: string): Promise<string>;
}

export declare class EidCard {
	readValidationData(): Promise<ValidationData>;
}

export declare interface ValidationData {
	authenticationCertificate: any,
	nonRepudiationCertificate: any,
	rnCertificate: any,
	rawAddressData: any,
	addressDataSignature: any,
	rawRnData: any,
	rnDataSignature: any,
	citizenCertificate: any
}

export declare const API: any;
export declare const Events: any;
export declare const StatusCodes: any;
