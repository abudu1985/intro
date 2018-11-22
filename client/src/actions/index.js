import {cardEditApply} from "./edit";
import {reactLocalStorage} from "reactjs-localstorage";
import {userLoginFail, userLoginSuccess} from "./user";
import {adminAddFail, adminAddSuccess, fetchAdmins} from "./admins";

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

export function  mixBlockNames(blockNames){
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
            .then(dispatch(fetchBlocks())   //changeOrderOfBlockNames(blockNames))
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
            .then(dispatch(fetchBlocks())
            )
            .catch(err => console.log('There was an error:' + err)
            );
    }
}

// update db with another blockNames order
export function changeOrderOfBlockNames(blockNames) {
    return { type: REORDER_BLOCK_NAMES, blockNames };
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
                console.log(response);
                response.json().then((data) =>{ console.log(data); dispatch(blockAddedSuccess()); dispatch(fetchBlocks())});  // dispatch(userLoginSuccess(data.admin ? true : false));
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
                  console.log(response);
                    response.json().then((data) =>{ console.log(data); dispatch(blockDeleteFail(data.message)); dispatch(fetchBlocks())});
                } else {
                    console.log(response);
                    dispatch(blockDeleteSuccess());
                }
            });
    }
}

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
                response.json().then((data) =>{ console.log(data); dispatch(blockUpdatedSuccess()); dispatch(fetchBlocks()); dispatch(fetchCards())});
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
                response.json().then((data) =>{ console.log(data); dispatch(blockCardsUpdatedSuccess()); dispatch(fetchBlocks()); fetchCards()});
            })
            .catch(err => console.log('There was an error when trying to update block cards:' + err)
            );
    }
}

export * from './edit';
export * from './user';