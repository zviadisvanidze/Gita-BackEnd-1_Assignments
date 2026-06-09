const fs = require('fs');
const path = require('path');

function countVowels(text) {
    const vowels = /[aeiouyაეიოუ]/gi;
    const matches = text.match(vowels);
    return matches ? matches.length : 0;
}


function countWords(text) {
    const trimmedText = text.trim();
    if (trimmedText === "") return 0;
    return trimmedText.split(/\s+/).length;
}

function analyzeFolder(dirPath) {
    let totalWords = 0;
    let totalVowels = 0;

    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const subFolderResult = analyzeFolder(fullPath);
            totalWords += subFolderResult.words;
            totalVowels += subFolderResult.vowels;
        } else if (stat.isFile() && path.extname(fullPath) === '.txt') {
            const content = fs.readFileSync(fullPath, 'utf-8');
            
            totalWords += countWords(content);
            totalVowels += countVowels(content);
        }
    });

    return { words: totalWords, vowels: totalVowels };
}

const result = analyzeFolder(__dirname);

console.log(`=== ანალიზის შედეგი ===`);
console.log(`სულ სიტყვების რაოდენობა: ${result.words}`);
console.log(`სულ ხმოვნების რაოდენობა: ${result.vowels}`);