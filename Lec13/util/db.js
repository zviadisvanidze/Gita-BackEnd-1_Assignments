import fs from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'expenses.json');

export const readExpenses = () => {
    try {
        if (!fs.existsSync(FILE_PATH)) return [];
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

export const writeExpenses = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};