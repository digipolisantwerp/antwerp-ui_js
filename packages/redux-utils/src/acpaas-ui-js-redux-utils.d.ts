import { Action, Reducer } from 'redux';

export declare interface ProgressReducerState<T = any> {
	loading: boolean;
	error: string;
	created: Date,
	lastUpdated: Date,
	result: T;
}

export declare interface BasicTypeReducerOptions {
	type?: string;
	progress?: boolean;
	dataType?: string;
}

export declare interface TargetReducerOptions {
	type?: string;
	progress?: boolean;
}

export declare const progressReducer: <T = any>(type: string, reducer: Reducer<T>) => (state: ProgressReducerState<T>, action: Action) => ProgressReducerState<T>;
export declare const basicTypeReducer: <T = any>(options: BasicTypeReducerOptions, state: T) => Reducer<T>;
export declare const targetReducer: <T = any, U = any>(options: TargetReducerOptions, reducer: Reducer<T>, initialState?: U) => Reducer<U>;
