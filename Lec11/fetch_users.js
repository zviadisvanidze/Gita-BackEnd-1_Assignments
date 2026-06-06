const fs = require('fs');

const url = 'https://jsonplaceholder.typicode.com/users';

fetch(url)
  .then(response => response.json())
  .then(users => {
    
    const filteredUsers = [];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      filteredUsers.push({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
      });
    }

    fs.writeFileSync('users.json', JSON.stringify(filteredUsers, null, 2), 'utf-8');
    console.log('მონაცემები ჩაიწერა users.json ფაილში!');
  })
  .catch(error => {
    console.error('შეცდომა მონაცემების წამოღებისას:', error);
  });