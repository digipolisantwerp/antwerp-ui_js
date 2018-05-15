import progressReducer from "./progress";
import verifyAction from "../utils/verify-action";
import noopReducer from "../utils/noop-reducer";

export default (
    {
        type = "",
        progress = false
    } = {},
    reducer = noopReducer,
    initialState = null
) => (
    state = initialState,
    action = {}
) => {
    if (!verifyAction(type, action) || !action.target) {
        return state;
    }

    return {
        ...state,
        [action.target]: progress ? progressReducer(type, reducer)(state, action) : reducer(state, action)
    };
};
