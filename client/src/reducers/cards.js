import { SEARCH_FILTER, CARDS_DOWNLOADED, CARD_REMOVED, EDITE_CARD } from '../actions';


const cards = (state = [], action) => {
  switch (action.type) {
    case CARDS_DOWNLOADED:
      return action.cards.map(card => Object.assign(
          {},
          card,
          {
            pic: '/api' + card.pic,
            url: (/^\/url/.test(card.url) ? '/api' + card.url : card.url)
          }
      ));
    case SEARCH_FILTER:
      return state.map((card) => {
        if (!action.text) {
          return Object.assign({}, card, {
            hidden: false
          });
        }

        let pattern = '(' + action.text.replace(/[\W]/g,'').split('').join('[\\W]*') + ')';
        let r = new RegExp(pattern, 'gi');
        let hidden = true;
        if (r.test(card.title) || r.test(card.description)) {
          hidden = false;
        }
        card.tags.forEach(function (item, i, arr) {
            if (r.test(item)) {
                hidden = false;
            }
        });
        return Object.assign({}, card, {
          hidden: hidden
        });
      });
    case CARD_REMOVED:
      return state.filter(card => card.id !== action.id);
    case EDITE_CARD:
      return state.map(card => (card.id === action.id ? Object.assign({}, card, {editing: !card.editing}) : card));
    default:
      return state;
  }
}

export default cards;