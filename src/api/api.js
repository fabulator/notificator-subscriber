import { Api, DefaultResponseProcessor, DefaultApiException } from 'rest-api-handler';
import { apiUrl } from './../config';

const api = new Api(
    apiUrl,
    [new DefaultResponseProcessor(DefaultApiException)],
    {
        'Content-Type': 'application/json',
    },
);

export default api;
