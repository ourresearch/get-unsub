# get-unsub mapping

## root

- package.json: dependencies (also includes script commands; e.g., `npm run serve -- --port 8081` to run this code locally uses the command `serve` defined in this file)
- package-lock.json: dependencies lockfile
- vue.config.js: Vue.js config file
- webpack.config.js: Webpack config file
- babel.config.js: Babel config file
- server.js: file used to run this Vue.js app on Heroku via the command `npm start` (see https://dashboard.heroku.com/apps/get-unsub/resources)
- some other of these files may be important; the above is not an exhaustive list

## src

- assets (images/logos/etc)
- components (all resuable components; organized into components used within files in the views folder, e.g., `components/Institution` has files used in `views/Institution.vue`)
	- `router/index.js` holds the routing rules for the app
- plugins (contains any plugins, only Vuetify at this time)
- shared (has various data objects used throughout the app)
- store (vuex store (aka "state") directory, has files for root store (`index.js`), and modules including institution, publisher, scenario, etc.)
- views (entry point files for application routes, e.g., Institution for the landing page at route `/i/<some_institution_id>`)
- api.js (Importantly, holds routes for connecting to jump-api Unsub backend API; also defines get/post/etc REST methods for connecting to backend API)
- App.vue (main app page)
- main.js (entry point for app, calls App.vue; this file is implicitly used as the entry point for `vue-cli-service serve`, but could be explicitly specified in the file `vue.config.js`; run `vue inspect` to see the entire configuration used for this app)
- appConfigs.js (metadata used throughout the app)

## public

- logo, favicon, etc

## Documentation/etc

- README.md
- RELEASE_NOTES.md
- LICENSE
- docs/get-unsub-mapping.md (this file)
