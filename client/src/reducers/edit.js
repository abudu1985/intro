import * as editActions from '../actions/edit';


const defaultState = {
  editing: false,
  id: null,
  blockName: '',
  title: '',
  pic: '',
  url: '',
  description: ''
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
    default:
      return state;
  }
}

export default edit;