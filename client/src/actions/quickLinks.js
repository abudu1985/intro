
import {addLog} from '../actions';
import {reactLocalStorage} from "reactjs-localstorage";

export const QUICK_LINKS_DOWNLOADED = 'QUICK_LINKS_DOWNLOADED';

export const quickLinksDownloaded = (quickLinks) => ({
    type: QUICK_LINKS_DOWNLOADED,
    quickLinks,
});

export function fetchQuickLinks() {
    return function (dispatch) {
        return fetch('/api/quick_links', {credentials: 'include'})
            .then(response => response.json())
            .then(json => dispatch(quickLinksDownloaded(json)));
    }
}

export function  mixQuickLinksCards(data){
    return function (dispatch) {
        return fetch('/api/quick_links/cards_reorder',
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
                        dispatch(fetchQuickLinks());
                        dispatch( addLog("QuickLinks", reactLocalStorage.get('user'),
                            "UPDATE", Date.now().toString(), "UPDATE CARDS ORDER WITHIN " + data.info));
                    });
                }
            )
            .catch(err => console.log('There was an error:' + err)
            );
    }
}

