import { combineReducers } from 'redux';
import edit from './edit';
import cards from './cards';
import admins from './admins';
import {
    SEARCH_FILTER,
    CARDS_DOWNLOADED,
    CARD_REMOVED,
    EDITE_CARD,
    BLOCK_NAMES_DOWNLOADED,
    ADD_BLOCK_NAME,
    BLOCKS_DOWNLOADED, DELETE_BLOCK_FAIL
} from '../actions';
import { USER_FETCH_INIT, USER_FETCH_DONE, USER_LOGIN_INIT, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL } from '../actions/user';


export function additions(state={showQuickLinks: true}, action) {
  switch(action.type) {
    case SEARCH_FILTER:
      let showQuickLinks = true;
      if (window.innerWidth < 1000 && action.text) {
        showQuickLinks = false;
      }
      return Object.assign({}, state, {showQuickLinks: showQuickLinks});
    default:
      return state;
  }
}

export function userInfo(state={logged: false, canEdit: false, errorMessage: '', processing: false, showRecaptcha: false}, action) {
  switch(action.type) {
    case USER_FETCH_INIT:
      return Object.assign({}, state, {processing: true});
    case USER_FETCH_DONE:
      return Object.assign({}, state, {logged: action.loggedIn, canEdit: action.canEdit, processing: false});
    case USER_LOGIN_INIT:
      return Object.assign({}, state, {processing: true, errorMessage: ''});
    case USER_LOGIN_SUCCESS:
      return Object.assign({}, state, {logged: true, canEdit: action.canEdit, processing: false, login: action.login});
    case USER_LOGIN_FAIL:
      return Object.assign({}, state, {errorMessage: 'Wrong username or password', processing: false, showRecaptcha: action.showRecaptcha});
    default:
      return state;
  }
}

export function blockNames(state = [], action) {
    switch (action.type) {
        case BLOCK_NAMES_DOWNLOADED:
            return action.blockNames[0].blockNames;
        default:
            return state;
    }
}

export function blocks(state = [], action) {
    switch (action.type) {
        case BLOCKS_DOWNLOADED:
            return action.blocks;
        default:
            return state;
    }
}

export function error(state={message: ''}, action) {
    switch(action.type) {
        case DELETE_BLOCK_FAIL:
            return Object.assign({}, state, {message: action.message});
        default:
            return state;
    }
}

const initialState = {
    cards: null,
    additions: null,
    userInfo: null,
    edit: null,
    admins: null,
    blockNames: null,
    blocks: null,
    error: null
};

export const rootReducer = (state={}, action) => {
    let resultState = Object.assign({}, state);
    resultState.cards = cards(resultState.cards, action);
    resultState.additions = additions(resultState.additions, action);
    resultState.userInfo = userInfo(resultState.userInfo, action);
    resultState.edit = edit(resultState.cards, resultState.edit, action);
    resultState.admins = admins(resultState.admins, action);
    resultState.blockNames = blockNames(resultState.blockNames, action);
    resultState.blocks = blocks(resultState.blocks, action);
    resultState.error = error(resultState.error, action);
    return resultState;
};