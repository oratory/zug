## zugz.ug - Log Analysis Tool for World of Warcraft Classic

### Local Environment
Looking to help with the site? To get this running locally you'll need NodeJS, a Redis server and a warcraftlogs.com API key.

Clone the repo and setup your config file:
```
git clone https://github.com/oratory/zug.git
cd zug
cp ./config-sample.json ./config.json
```

Modify the `config.json` file with your relevant information.

To setup and start the API server (which doubles as a static file host):
```
cd backend
npm install
node server.js
```

And to setup and start the frontend development server:

```
cd ../frontend
npm install
npm run serve
```

You can package things up with webpack, which puts the files in the `/backend/web` directory.
```
npm run build
```


### Attributions

Thanks to SVGBackgrounds.com for some stylish background SVGs.