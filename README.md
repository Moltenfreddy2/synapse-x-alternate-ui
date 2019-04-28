## Serverside WebSocket Integration

This application uses the Roblox exploit Synapse X's WebSocket API and Electron to create a secondary UI to execute local and eventually server scripts.
#### Running:
You can package the app with
```
npm run package-win
```
Or, you can run the app unpackaged with
 ```
npm start
```
#### Dependencies:
* For running the app unpackaged, Node.js and development dependencies must be installed.
* WebSocket must be enabled in Synapse X's theme.json file.
* For server-side execution (when it is added), you must have access to the backdoor.
#### Theming:
In the application's root directory, there is a file named `MonacoTheme.json`
This file contains the theme used by the application's editor, Monaco, and can easily be changed with [other themes](https://github.com/brijeshb42/monaco-themes/tree/master/themes).




