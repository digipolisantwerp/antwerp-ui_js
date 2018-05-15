export default (type, action) => {
    if (!type || !action || !action.type) {
        return false;
    }

    type = type.slice(-1) !== "/" ? `${type}/` : type;

    return action.type.indexOf(type) === 0;
};
