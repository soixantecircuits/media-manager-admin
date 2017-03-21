# media-manager-admin

Web interface for [media-manager](https://github.com/soixantecircuits/media-manager)

## Build Setup

``` bash
git clone git@github.com:soixantecircuits/media-manager-admin.git
cd media-manager-admin
yarn
```

## Configuration

You can configure `setting/default.json`:
```json
{
  "mediaManager": {
    "server": "localhost:8080",
    "apiRoute": "/api/v1"
  },
  "listRefreshInterval": 4,
  "nbDisplayedOptions": [ 5, 10, 25, 50 ]
}
```

`mediaManager.server` is the media-manager server's adress.
`mediaManager.apiRoute` is the base route to media-manager's endpoints.
`listRefreshInterval` is the interval at which the list view is updated.
`nbDisplayedOptions` is an array of possible number of medias displayed in one page.

If you want to change the port to listen to, you can do so by modifying the port in `config/index.js`. The default port is `4242`.

media-manager-admin requires [media-manager](https://github.com/soixantecircuits/media-manager) to be running in order to use the application

## Run

```bash
# Start the application
npm start
```

When the application has started, you can access `localhost:[your_port]`, to display and moderate the files in the media-moderator server.