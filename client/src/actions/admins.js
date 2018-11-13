export const ADD_ADMIN_INIT = 'ADD_ADMIN_INIT';
export const ADD_ADMIN_SUCCESS = 'ADD_ADMIN_SUCCESS';
export const ADD_ADMIN_FAIL = 'ADD_ADMIN_FAIL';
export const ADMINS_DOWNLOADED = 'ADMINS_DOWNLOADED';

export const addAdminInit = () => ({
    type: ADD_ADMIN_INIT,
});

export const adminAddSuccess = (data) => ({
    type: ADD_ADMIN_SUCCESS,
    payload: data,
});

export const adminAddFail = () => ({
    type: ADD_ADMIN_FAIL
});

export const adminsDownloaded = (data) => ({
    type: ADMINS_DOWNLOADED,
   data,
});

export function fetchAdmins() {
    return function (dispatch) {
        return fetch('/api/admins', {credentials: 'include'})
            .then(response => response.json())
            .then(json => dispatch(adminsDownloaded(json)));
    }
}

export const addAdmin = (data) => {
    return dispatch => {
        dispatch(addAdminInit());
        return fetch(
            '/api/admins/add',
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
                    dispatch(adminAddFail());
                } else {
                    dispatch(adminAddSuccess(data));
                }
            });
    }
}

export const deleteAdmin = (id, initiator) => {
    return function(dispatch) {
        return fetch('/api/admins/' + id + '/by/' + initiator, {method: 'DELETE', credentials: 'include'})
            .then(response => response.json())
            .then(json => {
                dispatch(fetchAdmins());
            });
    }
}