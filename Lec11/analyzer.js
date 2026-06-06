
const fs = require('fs');

try {

    const text = fs.readFileSync('random.txt', 'utf-8');

    const vowelsList = ['ა', 'ე', 'ი', 'ო', 'უ', 'a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];

    let totalChars = text.length;
    let wordCount = 0;
    let vowelCount=0;

    for (let i = 0; i < text.length; i++) {
        if (vowelsList.includes(text[i])) {
            vowelCount++;
        }
    }

    const words = text.trim().split(/\s+/);

    if (text.trim() === '') {
        wordCount = 0;
    } else {
        wordCount = words.length;
    }

    const result = {
        word: wordCount,
        vowel: vowelCount,
        chars: totalChars
    };

    fs.writeFileSync('result.json', JSON.stringify(result, null, 2), 'utf-8');
    console.log('შედეგი ჩაწერილია result.json-ში:', result);

} catch (error) {
    console.error('შეცდომა ფაილის დამუშავებისას.', error);
}