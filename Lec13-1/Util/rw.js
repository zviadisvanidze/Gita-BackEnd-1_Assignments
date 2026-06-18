const fs = require('fs/promises');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../expenses.json');
console.log("FILE_PATH:", FILE_PATH);
async function readExpenses() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
       
        return [];
    }
}


async function writeExpenses(data) {
    try {
        await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('ფაილში ჩაწერის შეცდომა:', error);
        throw new Error('მონაცემების შენახვა ვერ მოხერხდა');
    }
}

module.exports = {
    readExpenses,
    writeExpenses
};