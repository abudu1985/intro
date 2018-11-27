import {fetchCards, addLog} from '../actions';
import {reactLocalStorage} from "reactjs-localstorage";

export const CARD_EDIT_INIT = 'CARD_EDIT_INIT';
export const CARD_EDIT_CANCEL = 'CARD_EDIT_CANCEL';
export const CARD_EDIT_APPLY = 'CARD_EDIT_APPLY';
export const CARD_EDIT_DELETE = 'CARD_EDIT_DELETE';
export const CARD_EDIT_CHANGE = 'CARD_EDIT_CHANGE';
export const CARD_TAGS_EDIT_CHANGE = 'CARD_TAGS_EDIT_CHANGE';

export const cardEditInit = (cardID=null) => {
  return {
    type: CARD_EDIT_INIT,
    cardID: cardID
  };
};

export const cardEditChange = (field, value) => {
  return {
    type: CARD_EDIT_CHANGE,
    field: field,
    value: value
  };
};

export const cardTagsEditChange = (value) => {
    return {
        type: CARD_TAGS_EDIT_CHANGE, value
    };
}

export const cardEditCancel = () => {
  return {
    type: CARD_EDIT_CANCEL
  };
};

export const cardEditDelete = () => {
  return {
    type: CARD_EDIT_DELETE
  };
};

export const cardEditApply = () => {
  return {
    type: CARD_EDIT_APPLY
  };
};

export const deleteCard = () => {
  return function(dispatch, getState) {
    return fetch('/api/cards/' + getState().edit.id, {method: 'DELETE', credentials: 'include'})
      .then(response => response.json())
      .then(json => {
        dispatch(cardEditDelete());
        dispatch(fetchCards());
      });
  }
};

export const pushUpdate = () => {
  return (dispatch, getState) => {
    let result = {};
    let edit = Object.assign({}, getState().edit);
    ['pic', 'title', 'description', 'url', 'tags'].forEach(field => {
      if (field !== 'pic' || /^data:image/.test(edit[field])) {
        result[field] = edit[field];
      }
    });

    return fetch('/api/cards' + (edit.id ? '/' + edit.id : ''),
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(result),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(json => {
          console.log(result);
        dispatch(cardEditApply());
        dispatch(fetchCards());
        let info = " title: " + result.title + ", url: " + result.url + ", description: " + result.description + ", tags[" + result.tags.join() + "]";
        dispatch(addLog("Card", reactLocalStorage.get('user'),
            edit.id ? "UPDATE" : "ADD",
            Date.now().toString(), info
        ));
      });
  }
};