export const errorsReducer = (state = {}, action: any) => {
    if (action.type.includes('_FAIL')) {
        return action.payload.error;
    }

    return state;
};
