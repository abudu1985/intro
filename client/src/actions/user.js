import {reactLocalStorage} from 'reactjs-localstorage';

export const USER_FETCH_INIT = 'USER_FETCH_INIT';
export const USER_FETCH_IN_PROGRESS = 'USER_FETCH_IN_PROGRESS';
export const USER_FETCH_DONE = 'USER_FETCH_DONE';

export const USER_LOGIN_INIT = 'USER_LOGIN_INIT';
export const USER_LOGIN_IN_PROGRESS = 'USER_LOGIN_IN_PROGRESS';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';

export const userFetchInit = () => ({
  type: USER_FETCH_INIT
});

export const userFetchInProgress = () => ({
  type: USER_FETCH_IN_PROGRESS
});

export const userFetchDone = (loggedIn=false, canEdit=false) => ({
  type: USER_FETCH_DONE,
  loggedIn: loggedIn,
  canEdit: canEdit
});

export const doFetch = () => {
  return function (dispatch) {
    dispatch(userFetchInit());
    return fetch('/api/auth/login', {credentials: 'include'})
      .then(response => {
        if (response.status !== 200) {
          dispatch(userFetchDone());
        } else {
          response.json().then((data) => dispatch(userFetchDone(true, data.admin ? true : false)));
        }
      });
  }
}

export const userLoginInit = (login, password) => ({
  type: USER_LOGIN_INIT,
  login: login,
  password: password
});

export const userLoginInProgress = () => ({
  type: USER_LOGIN_IN_PROGRESS
});

export const userLoginSuccess = (canEdit=false) => ({
  type: USER_LOGIN_SUCCESS,
  canEdit: canEdit,
});

export const userLoginFail = (showRecaptcha=false) => ({
  type: USER_LOGIN_FAIL,
  showRecaptcha: showRecaptcha
});

export const doLogin = (login, password, captcha) => {
  return dispatch => {
    dispatch(userLoginInit());
    return fetch(
      '/api/auth/login',
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({username: login, password: password, captcha: captcha}),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.status !== 200) {
            fetch('/api/auth/check_count/' + login, {method: 'GET'})
                .then(response => response.json())
                .then(data => dispatch(userLoginFail(data.show_recaptcha)));
        } else {
          response.json().then((data) =>{ reactLocalStorage.set('full_name', data.displayName); reactLocalStorage.set('user', login); dispatch(userLoginSuccess(data.admin ? true : false));});
        }
      });
  }
}