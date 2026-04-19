const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/gamepasses/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const response = await fetch(
            `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${userId}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.get('/groupgamepasses/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    try {
        const response = await fetch(
            `https://games.roblox.com/v1/groups/${groupId}/games?accessFilter=Public&limit=25&sortOrder=Asc`
        );
        const gamesData = await response.json();
        
        if (!gamesData.data || gamesData.data.length === 0) {
            return res.json({ gamepasses: [] });
        }

        // Get first game's ID
        const gameId = gamesData.data[0].rootPlace.id;
        
        // Now fetch gamepasses for that game
        const passResponse = await fetch(
            `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=100&sortOrder=Asc`
        );
        const passData = await passResponse.json();
        res.json(passData);
    } catch (error) {
        res.status(500).json({ error: 'Failed: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
