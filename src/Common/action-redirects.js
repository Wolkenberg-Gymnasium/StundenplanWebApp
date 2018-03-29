import moment from 'moment';


const actionRedirector = store => next => action => {
    next(action);
    switch (action.type) {
        case "SET_TIMETABLE": case "SET_MY_TIMETABLE": case "GET_ME_RECEIVED":
        case "COUNTER_CHANGED": case "CHANGE_WEEK": case "SET_DATE": {
            let { timetableDate, currentTimeTableId, currentTimeTableType } = store.getState().timetable;
            let { id, type } = action.payload;
            if (id && type) {
                next({ type: "GET_TIMETABLE", payload: { id, type } });
            }
            id = id || currentTimeTableId;
            type = type || currentTimeTableType;
            if (id && type) {
                return next({
                    type: 'GET_SUBSTITUTIONS',
                    payload: {
                        id,
                        type,
                        year: moment(timetableDate).year(),
                        week: moment(timetableDate).week()
                    }
                });
            }
            break;
        }
        default: ;
    }
};

export default actionRedirector;