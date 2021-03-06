//----------------------------------------------------------------------------
// Contains function to log in output console
//----------------------------------------------------------------------------
const vscode = require('vscode')

//----------------------------------------------------------------------------
const outputChannel = vscode.window.createOutputChannel("Nik")

//----------------------------------------------------------------------------
function log(text) {
    console.log(text)
    outputChannel.appendLine(text)
}

//----------------------------------------------------------------------------
module.exports = {
	log,
}