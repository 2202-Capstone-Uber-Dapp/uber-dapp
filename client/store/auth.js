import axios from 'axios';
import history from '../history';

const TOKEN = 'token';

/**
 * ACTION TYPES
 */
const SET_AUTH = 'SET_AUTH';

/**
 * ACTION CREATORS
 */
const setAuth = (auth) => ({ type: SET_AUTH, auth });

/**
 * THUNK CREATORS
 */
export const fetchUserInfo = () => async (dispatch) => {
  const res = await axios.get('/api/user/');
  return dispatch(setAuth(res.data));
};

export const userSignUp = (user) => async (dispatch) => {
  try {
    const res = await axios.post('/api/user', user);
    dispatch(setAuth(res.data));
  } catch (err) {
    console.log(err);
  }
};

export const editProfile = (user) => async (dispatch) => {
  try {
    const {userName, role , photo} = user;
    const res = await axios.put('/api/user', {username: userName, role: role , profileImage: photo});
    dispatch(setAuth(res.data));
  } catch (err) {
    console.log(err);
  }
}
export const logout = () => {
  window.localStorage.removeItem(TOKEN);
  history.push('/login');
  return {
    type: SET_AUTH,
    auth: {},
  };
};

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth;
    default:
      return state;
  }
}
