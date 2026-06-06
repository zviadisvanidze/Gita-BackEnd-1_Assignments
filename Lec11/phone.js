// phone.js
const fs = require('fs');

const FILE_NAME = 'contacts.json';
const args = process.argv.slice(2);
const command = args[0];

function readContacts() {
  try {
    const data = fs.readFileSync(FILE_NAME, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveContacts(contacts) {
  fs.writeFileSync(FILE_NAME, JSON.stringify(contacts, null, 2), 'utf-8');
}

if (command === 'add') {
  const phone = args[1];
  const name = args[2];

  if (!phone || !name) {
    console.log('გთხოვთ მიუთითოთ ნომერიც და სახელიც.');
    process.exit(1);
  }

  const contacts = readContacts();

  let exists = false;
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].phone === phone) {
      exists = true;
      break;
    }
  }

  if (exists) {
    console.log(`ნომერი ${phone} უკვე არსებობს ბაზაში!`);
  } else {
    contacts.push({ phone: phone, name: name });
    saveContacts(contacts);
    console.log(`კონტაქტი ${name} (${phone}) წარმატებით დაემატა.`);
  }

} else if (command === 'delete') {
  const phone = args[1];

  if (!phone) {
    console.log('გთხოვთ მიუთითოთ წასაშლელი ნომერი.');
    process.exit(1);
  }

  const contacts = readContacts();
  const updatedContacts = [];
  let found = false;

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].phone === phone) {
      found = true;
    } else {
      updatedContacts.push(contacts[i]);
    }
  }

  if (found) {
    saveContacts(updatedContacts);
    console.log(`ნომერი ${phone} წარმატებით წაიშალა.`);
  } else {
    console.log(`ნომერი ${phone} ვერ მოიძებნა.`);
  }

} else if (command === 'show') {
  const contacts = readContacts();
  if (contacts.length === 0) {
    console.log('კონტაქტების სია ცარიელია.');
  } else {
    console.log('--- კონტაქტების სია ---');
    for (let i = 0; i < contacts.length; i++) {
      console.log(`${contacts[i].name}: ${contacts[i].phone}`);
    }
  }
} else {
  console.log('არასწორი ბრძანება. გამოიყენეთ: add, delete ან show');
}