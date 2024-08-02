import { combineReducers } from 'redux';
import loginReducers from './authReducer';
import toastReducer from './toastReducer';

export default combineReducers( {
    loginUser: loginReducers,
    toasts: toastReducer,
} );
