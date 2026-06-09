const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const JSON_FILE_PATH = path.join(__dirname, 'players.json');

// დამხმარე ფუნქციები ფაილის წასაკითხად და ჩასაწერად
const readPlayersFromFile = () => {
    try {
        const data = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writePlayersToFile = (data) => {
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// სერვერის შექმნა
const server = http.createServer((req, res) => {
  
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

   
    const sendJSON = (status, data) => {
        res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(data));
    };

    // 1. GET /about
    if (pathname === '/about' && method === 'GET') {
        return sendJSON(200, {
            name: "გიორგი",
            lastname: "ბერიძე",
            hobby: "პროგრამირება და ფეხბურთი",
            profession: "Node.js დეველოპერი"
        });
    }

    // 2. GET /players 
    if (pathname === '/players' && method === 'GET') {
        const players = readPlayersFromFile();
        const nation = parsedUrl.query.nation;

        if (nation) {
            const filteredPlayers = players.filter(
                p => p.nation.toLowerCase() === nation.toLowerCase()
            );
            return sendJSON(200, filteredPlayers);
        }

        return sendJSON(200, players);
    }

    // 3. POST /players 
    if (pathname === '/players' && method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
           
                
                const { name, age, nation, club } = JSON.parse(body);

                const players = readPlayersFromFile();

                const newPlayer = {
                    id: players.length > 0 ? players[players.length - 1].id + 1 : 1,
                    name,
                    age,
                    nation,
                    club
                };

                players.push(newPlayer);
                writePlayersToFile(players);

                return sendJSON(201, { message: "ფეხბურთელი წარმატებით დაემატა", player: newPlayer });
            } catch (err) {

                console.log("input:", JSON.stringify(body));
                return sendJSON(400, { error: "არასწორი JSON ფორმატი!" });
            }
        });
        return;
    }

    // 4. DELETE /players/:id 
    const deleteMatch = pathname.match(/^\/players\/(\d+)$/);
    
    if (deleteMatch && method === 'DELETE') {
        const playerId = parseInt(deleteMatch[1]); 
        let players = readPlayersFromFile();

        const playerExists = players.some(p => p.id === playerId);

        if (!playerExists) {
            return sendJSON(404, { error: "ასეთი ID-ით ვერ მოიძებნა" });
        }

        players = players.filter(p => p.id !== playerId);
        writePlayersToFile(players);

        return sendJSON(200, { message: `ID-ით ${playerId} წარმატებით წაიშალა` });
    }

    // 5. PUT /players/:id 
    const updateMatch = pathname.match(/^\/players\/(\d+)$/);

    if (updateMatch && method === 'PUT') {
        const playerId = parseInt(updateMatch[1]); 
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
               
                const { name, age, nation, club } = JSON.parse(body);

                let players = readPlayersFromFile();
                
                const playerIndex = players.findIndex(p => p.id === playerId);

                if (playerIndex === -1) {
                    return sendJSON(404, { error: "ასეთი ID-ით ვერ მოიძებნა" });
                }

                players[playerIndex] = {
                    id: playerId, 
                    name: name || players[playerIndex].name,
                    age: age || players[playerIndex].age,
                    nation: nation || players[playerIndex].nation,
                    club: club || players[playerIndex].club
                };

                writePlayersToFile(players);

                return sendJSON(200, { 
                    message: ` ID-ით ${playerId} წარმატებით განახლდა`, 
                    player: players[playerIndex] 
                });

            } catch (err) {
                return sendJSON(400, { error: "არასწორი JSON ფორმატი!" });
            }
        });
        return;
    }

    sendJSON(404, { error: "გვერდი ვერ მოიძებნა" });
});


server.listen(PORT, () => {
    console.log(`სერვერი გაეშვა მესამე პორტზე: http://localhost:${PORT}`);
});