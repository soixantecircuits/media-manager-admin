# media-moderator-web

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
  "states": [ "public", "private", "unlisted" ]
}
```

`moderatorServer` is the media-moderator server's domain to send the requests to.
`states` is an array of all the possible states your files can be set to. If `states` is not defined, you will be able to give any state to your files.

If you want to change the port to listen to, you can do so by modifying the port in `config/index.js`. The default port is `4242`.

## Run

```bash
# Start the application
npm run dev
```

When the application has started, you can access `localhost:[your_port]`, to display the list of files in the media-moderator server.