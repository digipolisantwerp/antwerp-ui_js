import progressReducer from "./progress";

const typeActions = (type) => {
    const upperType = type.toUpperCase().replace(/\s/g, "");
    const actionLoad = `${upperType}/LOAD`;
    const actionLoadMore = `${upperType}/LOAD_MORE`;
    const actionClear = `${upperType}/CLEAR`;

    return {
        actionLoad,
        actionLoadMore,
        actionClear
    };
};

const handleState = (
    state,
    action,
    {
        actionLoad,
        actionLoadMore,
        actionClear
    },
    {
        dataType
    }
) => {
    if (action.type === actionLoad) {
        return action.data;
    }

    if (action.type === actionLoadMore) {
        return dataType === "list" ? [...state, ...action.data] : action.data;
    }

    if (action.type === actionClear) {
        return dataType === "list" ? [] : null;
    }

    return state;
};

const reducer = (
    {
        type,
        dataType
    },
    initialState
) => (
    state = initialState,
    action
) => {
    const currState = state !== undefined ? state : dataType === "list" ? [] : null;

    return handleState(
        currState,
        action,
        typeActions(type),
        {
            type,
            dataType
        }
    );
};

const basicTypeReducer =  (
    {
        type = "BASIC_DEFAULT",
        progress = false,
        dataType = "single"
    } = {},
    initialState
) => {
    let wrappedReducer = reducer(
        {
            type,
            dataType
        },
        initialState
    );

    if (progress) {
        wrappedReducer = progressReducer(type, wrappedReducer);
    }

    return wrappedReducer;
};

export default basicTypeReducer;