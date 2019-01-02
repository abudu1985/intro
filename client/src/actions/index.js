import {cardEditApply} from "./edit";
import {reactLocalStorage} from "reactjs-localstorage";
import {userLoginFail, userLoginSuccess} from "./user";
import {adminAddFail, adminAddSuccess, fetchAdmins} from "./admins";
import {addTagInit, tagAddFail, tagAddSuccess} from "./tags";
import {fetchQuickLinks} from "./quickLinks";

export const SEARCH_FILTER = 'SEARCH_FILTER';
export const CARDS_DOWNLOADED = 'CARDS_DOWNLOADED';
export const CARD_REMOVED = 'CARD_REMOVED';
export const EDITE_CARD = 'EDITE_CARD';
export const BLOCK_NAMES_DOWNLOADED = 'BLOCK_NAMES_DOWNLOADED';
export const REORDER_BLOCK_NAMES = 'REORDER_BLOCK_NAMES';
export const ADD_BLOCK_NAME = 'ADD_BLOCK_NAME';
export const DELETE_BLOCK_NAME = 'DELETE_BLOCK_NAME';
export const UPDATE_BLOCK_NAME = 'UPDATE_BLOCK_NAME';
export const BLOCKS_DOWNLOADED = 'BLOCKS_DOWNLOADED';
export const DELETE_BLOCK_FAIL = 'DELETE_BLOCK_FAIL';
export const DELETE_BLOCK_SUCCESS = 'DELETE_BLOCK_SUCCESS';
export const UPDATE_BLOCK_CARDS = 'UPDATE_BLOCK_CARDS';
export const LOGS_ADD_FAIL = 'LOGS_ADD_FAIL';
export const LOGS_ADD_SUCCESS = 'LOGS_ADD_SUCCESS';
export const LOGS_DOWNLOADED = 'LOGS_DOWNLOADED';


export function searchFilter(text) {
  return { type: SEARCH_FILTER, text };
}

export function editeCard(id) {
  return { type: EDITE_CARD, id };
}

export function cardsDownloaded(cards) {
  return { type: CARDS_DOWNLOADED, cards };
}

export function blockNamesDownloaded(blockNames) {
    return { type: BLOCK_NAMES_DOWNLOADED, blockNames };
}

export function blocksDownloaded(blocks) {
    return { type: BLOCKS_DOWNLOADED, blocks };
}

export function logsDownloaded(logs) {
    return { type: LOGS_DOWNLOADED, logs };
}

export function cardRemoved(id) {
  return { type: CARD_REMOVED, id };
}

export function fetchCards() {
  return function (dispatch) {
    return fetch('/api/cards', {credentials: 'include'})
      .then(response => response.json())
      .then(json => dispatch(cardsDownloaded(json)));
  }
}

export function fetchBlocks() {
    return function (dispatch) {
        return fetch('/api/cards/blocks', {credentials: 'include'})
            .then(response => response.json())
            .then(json => dispatch(blocksDownloaded(json)));
    }
}

export function fetchLogs() {
    return function (dispatch) {
        return fetch('/api/logs', {credentials: 'include'})
            .then(response => response.json())
            .then(json => dispatch(logsDownloaded(json)));
    }
}

export function mixBlockNames(blockNames) {
    return function (dispatch) {
        return fetch('/api/cards/block_names_reorder',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(blockNames),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                    response.json().then((data) =>{
                        dispatch(fetchBlocks());
                        dispatch( addLog("Block", reactLocalStorage.get('user'),
                                "UPDATE", Date.now().toString(), "UPDATE BLOCKS ORDER for: " + blockNames.info));
                    });
                }
            )
            .catch(err => console.log('There was an error:' + err)
            );
    }
}

export function  mixCards(data){
    return function (dispatch) {
        return fetch('/api/cards/cards_reorder',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                    response.json().then((res) =>{
                        dispatch(fetchBlocks());
                        dispatch( addLog("Block", reactLocalStorage.get('user'),
                            "UPDATE", Date.now().toString(), "UPDATE CARDS ORDER WITHIN BLOCK: " + data.info));
                    });
                }
            )
            .catch(err => console.log('There was an error:' + err)
            );
    }
}

// when block added
export function blockAddedSuccess() {
    return { type: ADD_BLOCK_NAME};
}

// when block deleted
export function blockDeletedSuccess() {
    return { type: DELETE_BLOCK_NAME};
}

// when block updated
export function blockUpdatedSuccess() {
    return { type: UPDATE_BLOCK_NAME};
}

// when block cards updated
export function blockCardsUpdatedSuccess() {
    return { type: UPDATE_BLOCK_CARDS};
}

export function blockDeleteFail(message) {
    return { type: DELETE_BLOCK_FAIL, message};
}

export function blockDeleteSuccess() {
    return { type: DELETE_BLOCK_SUCCESS};
}

export function logsAddFail() {
    return { type: LOGS_ADD_FAIL};
}

export function logsAddSuccess(data) {
    return { type: LOGS_ADD_SUCCESS, data};
}

// addBlock
export function addBlock(blockName) {
    console.log(blockName);
    return function (dispatch) {
        return fetch('/api/blocks/add',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(blockName),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                response.json().then((data) =>{
                    dispatch(blockAddedSuccess());
                    dispatch(fetchBlocks());
                    dispatch(addLog("Block", reactLocalStorage.get('user'), "ADD", Date.now().toString(), blockName.name));
                });
            })
            .catch(err => console.log('There was an error:' + err)
            );
    }
}

// deleteBlock
export const deleteBlock = (id) => {
    return function(dispatch) {
        return fetch('/api/blocks/' + id, {method: 'DELETE', credentials: 'include'})
            .then(response => {
                if (response.status !== 200) {
                    response.json().then((data) =>{ console.log(data); dispatch(blockDeleteFail(data.message)); dispatch(fetchBlocks())});
                } else {
                    console.log(response);
                    dispatch(blockDeleteSuccess());
                    dispatch(addLog("Block", reactLocalStorage.get('user'), "DELETE", Date.now().toString(), id));
                }
            });
    }
};

// update block
export function updateBlock(index, data) {
    return function (dispatch) {
        return fetch('/api/blocks/update/' + index,
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                response.json().then((res) =>{
                    dispatch(blockUpdatedSuccess());
                    dispatch(fetchBlocks());
                    dispatch(fetchCards());
                    if(!res.message){
                        let str = "title: " + data.newName + ", description: " + data.newDescription;
                        dispatch(addLog("Block", reactLocalStorage.get('user'), "UPDATE", Date.now().toString(), str) );
                    }
                });
            })
            .catch(err => console.log('There was an error when trying to update block name:' + err)
            );
    }
}

export function updateBlockCards(data) {
    return function (dispatch) {
        return fetch('/api/blocks/update_cards',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                response.json().then((res) =>{
                    console.log(res);
                    dispatch(blockCardsUpdatedSuccess());
                    dispatch(fetchBlocks());
                    dispatch(fetchCards());
                    dispatch(addLog("Block", reactLocalStorage.get('user'), "UPDATE", Date.now().toString(), "UPDATE BLOCK CARDS FOR /" + data.name + "/ " + data.info));
                });
            })
            .catch(err => console.log('There was an error when trying to update block cards:' + err)
            );
    }
}

export function updateQuickLinksCards(data) {
    return function (dispatch) {
        return fetch('/api/quick_links/update_cards',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                response.json().then((res) =>{
                    console.log(res);
                    dispatch(fetchQuickLinks());
                    dispatch(addLog("QuickLinks", reactLocalStorage.get('user'), "UPDATE", Date.now().toString(), "UPDATE QUICK LINKS CARDS" + " / " + data.info));
                });
            })
            .catch(err => console.log('There was an error when trying to update QuickLinks cards:' + err)
            );
    }
}

export const addLog = (entity, initiator, action, date, info) => {

    const data = {
        entity: entity,
        initiator: initiator,
        action: action,
        date: date,
        info: info
    };

    return dispatch => {
        return fetch(
            '/api/logs/add',
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
                console.log(response);
                if (response.status !== 200) {
                    dispatch(logsAddFail());
                } else {
                    dispatch(logsAddSuccess(data));
                    dispatch(fetchLogs());
                }
            });
    }
};

export * from './edit';
export * from './user';