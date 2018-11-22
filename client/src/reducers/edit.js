import * as editActions from '../actions/edit';
import {REMOVE_TAG_FROM_CARD} from "../actions/tags";


const defaultState = {
  editing: false,
  id: null,
  blockName: '',
  title: '',
  pic: '',
  url: '',
  description: '',
  tags: []
};

const edit = (cards, state=defaultState, action) => {
  switch(action.type) {
    case editActions.CARD_EDIT_INIT:
      let cardInfo = cards.filter(card => card.id === action.cardID);
      if (!cardInfo.length) {
        return Object.assign({}, defaultState, {editing: true});
      }
      return Object.assign({}, state, cardInfo[0], {editing: true});
    case editActions.CARD_EDIT_CHANGE:
      return Object.assign({}, state, {[action.field]: action.value});
    case editActions.CARD_EDIT_APPLY:
    case editActions.CARD_EDIT_CANCEL:
    case editActions.CARD_EDIT_DELETE:
      return Object.assign({}, defaultState);
    case editActions.CARD_TAGS_EDIT_CHANGE:
      return Object.assign({}, state, {tags: [...state.tags, action.value]});
    case REMOVE_TAG_FROM_CARD:
      return Object.assign({}, state, {tags: [...state.tags.slice(0, action.index), ...state.tags.slice(action.index+1)]});
    default:
      return state;
  }
};

export default edit;