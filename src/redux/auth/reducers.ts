// apicore
import { APICore } from '../../helpers/api/apiCore';

// constants
import { AuthActionTypes } from './constants';

const api = new APICore();

const INIT_STATE = {
    user: null,
    loading: false,
    token: null,
    userLoggedIn: false,
    error: null,
};

type UserData = {
    id: number;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
};

type AuthActionType = {
    type: string;
    payload: any;
};

type State = {
    user: null | object;
    loading: boolean;
    token: null | string;
    userLoggedIn: boolean;
    error: null | string;
};

const Auth = (state: State = INIT_STATE, action: AuthActionType) => {
    switch (action.type) {
        case AuthActionTypes.LOGIN_USER:
            return {
                ...state,
                user: action.payload.admin,
                token: action.payload.token,
                userLoggedIn: true,
                loading: false,
                error: null
            };

        case AuthActionTypes.LOGOUT_USER:
            return {
                ...state,
                user: null,
                token: null,
                userLoggedIn: false,
            };

        case AuthActionTypes.RESET:
            return {
                ...state,
                loading: false,
                error: null,
            };

        case AuthActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case AuthActionTypes.LOGIN_USER: {
                    return {
                        ...state,
                        user: action.payload.data,
                        userLoggedIn: true,
                        loading: false,
                        error: null,
                    };
                }
                case AuthActionTypes.SIGNUP_USER: {
                    return {
                        ...state,
                        userSignUp: true,
                        loading: false,
                    };
                }
                case AuthActionTypes.LOGOUT_USER: {
                    return {
                        ...state,
                        user: null,
                        loading: false,
                        userLogout: true,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD: {
                    return {
                        ...state,
                        resetPasswordSuccess: action.payload.data,
                        loading: false,
                        passwordReset: true,
                    };
                }
                default:
                    return { ...state };
            }

        case AuthActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case AuthActionTypes.LOGIN_USER: {
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                        userLoggedIn: false,
                    };
                }
                case AuthActionTypes.SIGNUP_USER: {
                    return {
                        ...state,
                        registerError: action.payload.error,
                        userSignUp: false,
                        loading: false,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD: {
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                        passwordReset: false,
                    };
                }
                default:
                    return { ...state };
            }

        default:
            return { ...state };
    }
};

export default Auth;
