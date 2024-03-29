const defaultState = {
    notifications: [],
};

function errorDescription(type) {
    switch (type) {
        case 'COUNTER_ERROR':
            return 'Prüfen der aktuellen Version fehlgeschlagen';
        case 'GET_DATES_ERROR':
            return 'Abrufen der Termine fehlgeschlagen';
        case 'GET_ME_ERROR':
            return 'Abrufen der Benutzerinformationen fehlgeschlagen';
        case 'GET_TIMETABLE_ERROR':
            return 'Abrufen des Stundenplans fehlgeschlagen';
        case 'GET_SUBSTITUTIONS_ERROR':
            return 'Abrufen der Vertretungen fehlgeschlagen';
        case 'GET_UNREAD_MESSAGES_ERROR':
            return 'Abrufen von ungelesenen Nachrichten fehlgeschlagen';
        case 'GET_ASSIGNMENTS_ERROR':
            return 'Abrufen von Aufgaben fehlgeschlagen';
        case 'SERVICE_WORKER_AVAILABLE':
            return 'App ist nun offline verfügbar';
        case 'UPDATE_AVAILABLE':
            return 'Neue App-Version verfügbar';
        default:
    }
    return 'Unbekannter Fehler';
}

const reducer = (state = defaultState, action) => {
    const addNotification = (notification) => ({
        ...state,
        notifications: [
            ...state.notifications,
            {
                ...notification,
            },
        ],
    });
    if (action.type.endsWith('_ERROR')) {
        if (!action.payload) {
            return state;
        }
        const { text } = action.payload;
        if (text) {
            if (text.indexOf('offline') !== -1 || text.indexOf('timeout') !== -1) {
                // ignore offline errors
                return state;
            }
            return addNotification({
                key: new Date().getTime() + Math.random(),
                message: errorDescription(action.type),
                options: {
                    variant: 'error',
                },
            });
        }
    }
    if (action.type.endsWith('_RECEIVED')) {
        const text = {
            [action.type.startsWith('EDIT')]: 'editiert',
            [action.type.startsWith('ADD')]: 'hinzugefügt',
            [action.type.startsWith('DELETE')]: 'gelöscht',
            [action.type.startsWith('SEND')]: 'gesendet',
            [action.type.startsWith('SEND_FEEDBACK')]: 'gesendet. Danke für dein Feedback!',
        }[true];
        if (text) {
            return addNotification({
                key: new Date().getTime() + Math.random(),
                message: 'Erfolgreich ' + text,
                options: {
                    variant: 'success',
                },
            });
        }
    }
    switch (action.type) {
        case 'ENQUEUE_SNACKBAR':
            return addNotification(action.payload);
        case 'REMOVE_SNACKBAR':
            return {
                ...state,
                notifications: state.notifications.filter((notification) => notification.key !== action.key),
            };

        default:
            return state;
    }
};

export default reducer;
