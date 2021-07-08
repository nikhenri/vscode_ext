//----------------------------------------------------------------------------
// Function to do the completion after the '.'
//----------------------------------------------------------------------------
const vscode = require('vscode')
const utils = require('./utils')

//----------------------------------------------------------------------------
const provideCompletionItems = async (document, position) => {
	console.log(".")
	let linePrefix = document.lineAt(position).text.substr(0, position.character)
	if (!linePrefix.endsWith('.') || !isStructAccess(linePrefix)) return //avoid trig for nothing
	utils.getFileText() // init

	let fileNameWithoutExt = utils.uriToFileNameWithoutExt(document.uri)
	let textToSearchTypeName = (await utils.getFileText(fileNameWithoutExt)).text
	let groupMatch = getStructSectionWithoutIndex(linePrefix) //split the string in section

	for (let signalName of groupMatch) {
		let structTypeName = getTypeName(textToSearchTypeName, signalName)
		if(utils.wordIsReserved(structTypeName)) return // ex: logic toto;
		let matchInFileObj = await utils.getMatchInFileOrImport(fileNameWithoutExt, (text)=> searchStructInText(text, structTypeName))
		if(groupMatch[groupMatch.length-1] == signalName) { // last element, add member
			let structMemberList = getStructMemberList(matchInFileObj.match[0][0])
			let completionList = structMemberList.map(x=>new vscode.CompletionItem(x))
			return completionList
		} else { // if we are not the last section, init search text and filename
			textToSearchTypeName = matchInFileObj.match[0][0]
			fileNameWithoutExt = matchInFileObj.fileNameWithoutExt
		}
	}
	console.log("Not able to Complete");
}

//----------------------------------------------------------------------------
const isStructAccess = (text) => {
	return text.match(/[\w\.\[\]]+\.$/g)
}
//----------------------------------------------------------------------------
// split the string in section, toto[7:0].tata => [toto, tata]
const getStructSectionWithoutIndex = (text) => {
	let match = text.match(/[\w\.\[\]]+$/g) //match end of line something[666].
	let matchAll = Array.from(match[0].matchAll(/(\w+)(?:\[.*?\])?\./g)) //extract word
	let groupMatch = matchAll.map(x => x[1])
	return groupMatch
}

//----------------------------------------------------------------------------
const getTypeName = (str, signalName) => {
	// type(os_txOut_events_p) s_events_ptrWr_s;
	// input ts_bufferHandler_cbdma_ptrWr_in is_txIn_ptrWr_p,
	// ts_bufferHandler_cbdma_ptrWr_in [2:0] vg_byte_size_s
    let matchAll = Array.from(str.matchAll(new RegExp(`^[ ]*(?:input|output|inout)?[ ]*(\\w+)(\\(\\w+\\))?.*?${signalName}`, "gm")))
	let typeName = matchAll[0][1]
	if(typeName != "type") return typeName
	return getTypeName(str, matchAll[0][2].slice(1,-1))
}

//----------------------------------------------------------------------------
const searchStructInText = (text, structTypeName) => {
	return Array.from(text.matchAll(new RegExp(`struct(?:\\s+packed)?\\s*{[^}]*}\\s*${structTypeName}\\s*;`, "g")))
}

//----------------------------------------------------------------------------
const getStructMemberList = (str) => {
    let matchAll = Array.from(str.matchAll(/(\w+)\s*;/g))
    if (matchAll.length) return matchAll.map(x => x[1]).slice(0, -1) // throw last match (-1), it is the name
	return matchAll
}

//----------------------------------------------------------------------------
module.exports = {
	provideCompletionItems,
}
