import { fetchData } from '../../utils';
import AuthContext from './AuthContext';

const client_id = 'ef085784-4829-427c-ab32-5e90502a1dde';

export default class TokenAuthContext extends AuthContext {
    static resources = {
        'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/':
            'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/.default',
        'https://graph.microsoft.com/': 'https://graph.microsoft.com/.default',
    };

    constructor(client_secret) {
        super();
        this.client_secret = client_secret;
    }


    logOut() {
        super.logOut();
    }

    toObject() { }

    isLoggedIn() {
        const tokens = Object.values(this.tokens).length + Object.values(this.tokenAcquisistions).length;
        const resources = Object.values(TokenAuthContext.resources).length;
        return tokens >= resources;
    }

    isLoggingIn() {
        return true;
    }

    async aquireToken(token, endpoint) {
        const body = {
            client_secret: this.client_secret,
            client_id,
            scope: TokenAuthContext.resources[endpoint],
        };
        const response = await fetchData(`https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/token`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'Application/Json',
            },
        });
        return response;
    }
}