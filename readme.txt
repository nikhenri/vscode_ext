//after clone:
npm i

//remove module:
npm uninstall


//The package is not needed to publish, only for local testing
package:
vsce package

//publish:
vsce publish

// These publish will automaticly increase the version
vsce publish major
vsce publish minor
vsce publish patch


//manual install package:
code --install-extension nikhenri-5.1.4.vsix --force

// ** Sometime it seem stuck to prev version, need the clear cache: %USERPROFILE%\.vscode\extensions


// Usefull link:
// https://code.visualstudio.com/api/references/vscode-api
// https://code.visualstudio.com/api/working-with-extensions/publishing-extension

// https://www.youtube.com/watch?v=q5V4T3o3CXE&t=1164s&ab_channel=WebDevSimplified