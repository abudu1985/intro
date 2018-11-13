import {ADMINS_DOWNLOADED} from "../actions/admins";

export const ADD_ADMIN_INIT = 'ADD_ADMIN_INIT';
export const ADD_ADMIN_SUCCESS = 'ADD_ADMIN_SUCCESS';
export const ADD_ADMIN_FAIL = 'ADD_ADMIN_FAIL';

const admins = (state = [], action) => {
    switch (action.type) {
        case ADD_ADMIN_SUCCESS:
            return [...state, action.payload];
        case ADD_ADMIN_FAIL:
            return state;
        case ADD_ADMIN_INIT:
            return state;
        case ADMINS_DOWNLOADED:
            return action.data.map(admin => Object.assign({}, admin));
        default:
            return state;
    }
};

export default admins;