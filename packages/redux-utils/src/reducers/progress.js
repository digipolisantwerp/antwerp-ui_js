import verifyAction from "../utils/verify-action";
import noopReducer from "../utils/noop-reducer";

export default (
    type = "",
    reducer = noopReducer
) => (
    state = {
        loading: false,
        created: null,
        lastUpdated: null,
        error: null,
        result: null
    },
    {
        err = null,
        loading = false,
        ...action
    } = {}
) => {
    if (!verifyAction(type, action)) {
        return state;
    }

    const resultState = state ? state.result : null;
    const createdState = state ? state.created : null;
    const lastUpdatedState = state ? state.lastUpdated : null;

    const newState = (loading || err !== null) ? null : reducer(resultState, action);
    const created = createdState || new Date();
    const lastUpdated = (!lastUpdatedState || newState !== resultState) ? new Date() : lastUpdatedState;

    return {
        loading,
        created,
        lastUpdated,
        error: err,
        result: newState
    };
};
