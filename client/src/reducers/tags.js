import {TAGS_DOWNLOADED} from "../actions/tags";

export const ADD_TAG_INIT = 'ADD_TAG_INIT';
export const ADD_TAG_SUCCESS = 'ADD_TAG_SUCCESS';
export const ADD_TAG_FAIL = 'ADD_TAG_FAIL';

const tags = (state = [], action) => {
    switch (action.type) {
        case ADD_TAG_SUCCESS:
            return [...state, action.payload];
        case ADD_TAG_FAIL:
            return state;
        case ADD_TAG_INIT:
            return state;
        case TAGS_DOWNLOADED:
            return action.data.map(tag => Object.assign({}, tag));
        default:
            return state;
    }
};

export default tags;