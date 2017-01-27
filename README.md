# media-moderator-client

Web interface for [media-moderator](https://github.com/soixantecircuits/media-moderator)

## Build Setup

``` bash
git clone git@github.com:ybeaufort/media-moderator-web.git
cd media-moderator-web
npm install
```

## Configuration

You can configure `setting/default.json`:
```json
{
  "moderatorServer": "localhost:8080",
  "apiRoute": "/api/v1/medias",
  "listRefreshInterval": 4,
  "nbDisplayedOptions": [ 5, 10, 25, 50 ]
}
```

`moderatorServer` is the media-moderator server's domain to send the requests to.
`apiRoute` is the base route to media-moderator's endpoints.
`listRefreshInterval` is the interval at which the list view is updated.
`nbDisplayedOptions` is an array of possible number of medias displayed in one page.

If you want to change the port to listen to, you can do so by modifying the port in `config/index.js`. The default port is `4242`.

media-moderator-client requires [media-moderator](https://github.com/soixantecircuits/media-moderator) to be running in order to use the application

## Run

```bash
# Start the application
npm start
```

When the application has started, you can access `localhost:[your_port]`, to display and moderate the files in the media-moderator server.