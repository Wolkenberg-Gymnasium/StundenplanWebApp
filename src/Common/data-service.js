import { adalGetToken } from './Adal/react-adal';
import { adalConfig, authContext } from './Adal/adalConfig';

export const API_URL = 'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/';
export const GRAPH_URL = 'https://graph.microsoft.com/';

const handleErrors = (response) => {
	if (!response.ok) {
		throw response;
	}
	return response;
}

const requestApiGenerator = next => (endpoint, route, name, METHOD = "GET", body) => {
	adalGetToken(authContext, adalConfig.endpoints[endpoint]).then((token) =>
		fetch(endpoint + route, {
			method: METHOD,
			body,
			headers: {
				"Authorization": 'Bearer ' + token,
				"Content-Type": "Application/Json"
			}
		})
			.then(handleErrors)
			.then(res => res.json())
			.then((res) =>
				next({
					type: name + '_RECEIVED',
					payload: res
				}))
			.catch((err) =>
				next({
					type: name + '_ERROR',
					payload: err.message ? { text: err.message } : err
				})
			)
	)
}

const getImageGenerator = next => (endpoint, route, name) => {
	adalGetToken(authContext, adalConfig.endpoints[endpoint]).then((token) =>
		fetch(endpoint + route, {
			headers: {
				"Authorization": 'Bearer ' + token
			}
		})
			.then(res => res.blob())
			.then((blob) =>
				next({
					type: name + '_RECEIVED',
					payload: { blob }
				})
			)
			.catch((err) =>
				next({
					type: name + '_ERROR',
					payload: err
				})
			)
	)
}

const dataService = store => next => action => {
	next(action);
	switch (action.type) {
		case 'GET_ME':
			return requestApiGenerator(next)(API_URL, 'me', 'GET_ME');
		case 'GET_MASTERDATA':
			return requestApiGenerator(next)(API_URL, 'all', 'GET_MASTERDATA');
		case "SET_TIMETABLE":
			return next({ type: "GET_TIMETABLE" });
		case 'GET_TIMETABLE':
			return requestApiGenerator(next)(API_URL, `timetable/${action.payload.type}/${action.payload.id}`, 'GET_TIMETABLE');
		case "CHANGE_WEEK": case "SET_DATE": {
			let { currentTimeTableId, currentTimeTableType, timetableDate } = store.getState().timetable;
			return next({
				type: "GET_SUBSTITUTIONS", payload: {
					timetableDate,
					type: currentTimeTableType,
					id: currentTimeTableId
				}
			});
		}
		case "GET_SUBSTITUTIONS": {
			let week = action.payload.date.week();
			let year = action.payload.date.year();
			return requestApiGenerator(next)(API_URL,
				'substitution/' + (action.payload.type)
				+ '/' + (action.payload.id)
				+ '/' + year + '-' + week,
				'GET_SUBSTITUTIONS');
		}
		case 'GET_COUNTER':
			return requestApiGenerator(next)(API_URL, 'counter', 'COUNTER');
		case 'SET_NOTIFICATION':
			return requestApiGenerator(next)(API_URL, 'notifications', 'SET_NOTIFICATION',
				'POST', JSON.stringify(action.payload));
		case 'GET_PROFILE_PICTURE':
			return getImageGenerator(next)(GRAPH_URL, '/beta/me/photo/$value', 'PROFILE_PICTURE');
		case 'GET_PROFILE_PICTURE_SMALL':
			return getImageGenerator(next)(GRAPH_URL, '/beta/me/photos/48x48/$value', 'PROFILE_PICTURE_SMALL');
		default:
			break
	}
};

export default dataService