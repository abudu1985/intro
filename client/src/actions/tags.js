import {DELETE_BLOCK_FAIL} from "./index";
import {addLog} from '../actions';

export const ADD_TAG_INIT = 'ADD_TAG_INIT';
export const ADD_TAG_SUCCESS = 'ADD_TAG_SUCCESS';
export const ADD_TAG_FAIL = 'ADD_TAG_FAIL';
export const TAGS_DOWNLOADED = 'TAGS_DOWNLOADED';
export const REMOVE_TAG_FROM_CARD = 'REMOVE_TAG_FROM_CARD';
export const DELETE_TAG_FAIL = 'DELETE_TAG_FAIL';

export const addTagInit = () => ({
    type: ADD_TAG_INIT,
});

export const tagAddSuccess = (data) => ({
    type: ADD_TAG_SUCCESS,
    payload: data,
});

export const tagAddFail = () => ({
    type: ADD_TAG_FAIL
});

export const tagsDownloaded = (data) => ({
    type: TAGS_DOWNLOADED,
    data,
});

export const removeTagFromCard = (index) => ({
    type: REMOVE_TAG_FROM_CARD,
    index
});

export function fetchTags() {
    return function (dispatch) {
        return fetch('/api/tags', {credentials: 'include'})
            .then(response => response.json())
            .then(json => dispatch(tagsDownloaded(json)));
    }
}

export function tagDeleteFail() {
    return { type: DELETE_TAG_FAIL};
}


export const addTag = (data) => {
    return dispatch => {
        dispatch(addTagInit());
        return fetch(
            '/api/tags/add',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.status !== 200) {
                    dispatch(tagAddFail());
                } else {
                    dispatch(tagAddSuccess(data));
                    dispatch(addLog("Tag", data.addedBy, "ADD", data.id, data.name));
                }
            });
    }
}

export const deleteTag = (id, initiator) => {

    console.log(id, initiator);
    return function(dispatch) {
        return fetch('/api/tags/' + id + '/by/' + initiator, {method: 'DELETE', credentials: 'include'})
            .then(response => response.json())
            .then(json => {
                dispatch(fetchTags());
            });
    }
}

export const deleteTagFromCard = (index) => {
    return function(dispatch) {
        dispatch(removeTagFromCard(index));
    }
};