
import {authActionType, Tokens, toastType, apiBaseURL} from '../../constants';
import axios from 'axios';
import { environment } from '../../config/environment';
import toast from 'react-hot-toast';


export const registerAction = (user, navigate, setLoading) => async (dispatch) => {
    await axios.post(`${environment.URL}register`, user)
        .then((response) => {
            if(response.status == 200 && response.statusText == "OK"){
                navigate('/login')
                toast.success("Registered Successfully.");
            }
        })
        .catch(({response}) => {
            toast.error(response.data.message);
            setLoading(false);
        });
};
export const loginAction = (user, navigate, setLoading) => async (dispatch) => {
    try {
        const response = await axios.post(`${environment.URL}login`, user)
        console.log(response);

        toast.success("Logged in successfully");

    } catch (error) {
        toast.error(error.response.data.message);
    } finally {
        setLoading(false);
    }
};

export const logoutAction = (token, navigate) => async (dispatch) => {

    await axios.post(`${environment.URL}logout`, token)
        .then(() => {
            localStorage.removeItem(Tokens.ADMIN);
            localStorage.removeItem(Tokens.USER);
            localStorage.removeItem(Tokens.IMAGE);
            localStorage.removeItem(Tokens.FIRST_NAME);
            localStorage.removeItem(Tokens.LAST_NAME);
            localStorage.removeItem('loginUserArray');
            localStorage.removeItem(Tokens.UPDATED_EMAIL);
            localStorage.removeItem(Tokens.UPDATED_FIRST_NAME);
            localStorage.removeItem(Tokens.UPDATED_LAST_NAME);
            localStorage.removeItem(Tokens.USER_IMAGE_URL);
            localStorage.removeItem(Tokens.GET_PERMISSIONS);
            localStorage.removeItem('store_id');
            navigate('/login');
            toast.success("Logged out successfully");
        })
        .catch(({response}) => {
            toast.error(response.data.message);
        });
};

export const forgotPassword = (user) => async (dispatch) => {
    await axios.post(`${environment.URL}${apiBaseURL.ADMIN_FORGOT_PASSWORD}`, user).then((response) => {
        toast.success("Forgot password link send successfully");
    }).catch(({response}) => {
        toast.error(response.data.message);
    });
};

export const resetPassword = (user, navigate) => async (dispatch) => {
    await axios.post(`${environment.URL}${apiBaseURL.ADMIN_RESET_PASSWORD}`, user).then((response) => {
        toast.success("Reset password link send successfully");
        navigate('/login');
    }).catch(({response}) => {
        toast.error(response.data.message);
    });
};

