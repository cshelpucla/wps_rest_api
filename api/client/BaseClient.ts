
export class BaseClient{
    protected baseUrl: string;
    protected requestPromise: any;
    
    constructor(baseUrl, requestPromise){
        this.baseUrl = baseUrl;

        this.requestPromise = requestPromise.defaults({
            baseUrl: this.baseUrl,
            json: true
        })
    }

    get(uri){
        return this.requestPromise({
            method: 'GET',
            uri: uri
        });
    }

    post(uri, body){
        return this.requestPromise({
            method: 'POST',
            uri: uri,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
