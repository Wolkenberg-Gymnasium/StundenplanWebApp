import { AuthenticationContext } from './authContext';
import { getAuthContext, setAuthContext } from './storage';


export function getToken(resource) {
    return new Promise((resolve, reject) => {
        if (!navigator.onLine) {
            return reject({ message: "offline", msg: "offline" });
        }
        const authContext = getAuthContext();
        if (!authContext.isLoggedIn()) {
            authContext.login();
        }
        authContext.getToken(resource)
            .then(token => {
                resolve(token.access_token);
            }).catch(error => {
                reject(error);
            });
    });
}

export const runApplication = (app) => {
    const { code, session_state, state } = window.params;
    let authContext;
    if (AuthenticationContext.isIFrame()) {
        authContext = getAuthContext(window.parent);
        if (code) {
            authContext.handleCallback(code, session_state, state);
        }
        return;
    }
    authContext = getAuthContext();

    if (!authContext) {
        authContext = new AuthenticationContext();
        setAuthContext(authContext);
        authContext.login();
    } else {
        if (code) {
            // back to '/' without reloading page
            window.history.replaceState("", "", window.location.pathname);
            authContext.handleCallback(code, session_state, state);
        }
        app();
    }
}