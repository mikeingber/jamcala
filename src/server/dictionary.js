var dictionary = '';

function initialize() {
	if (!dictionary) {
		getDictionaryData("src/server/dictionary.txt");
    }
}

function getDictionaryData(path) {
     
  const fs = require('fs')

  fs.readFile(path, 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  dictionary = data.split('\n')
  })
}

function isValidWord(word) {
	return dictionary.includes(word);
}

initialize();

module.exports = { isValidWord }
