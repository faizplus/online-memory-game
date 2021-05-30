import { useEffect, useState } from "react";
import GameBoard from "./screens/GameBoard";
import GameStart from "./screens/GameStart";
import { getUpdatedGameData, startGame } from "./services/game";

function App() {
  const [gameData, setGameData] = useState({});

  const difficultySelected = async (selectedDifficulty) => {
    const data = startGame(selectedDifficulty);
    setGameData(data);
    localStorage.setItem("gameData", JSON.stringify(data));
  };

  const getGameData = () => {
    if (localStorage.getItem("gameData")) {
      const localGameData = JSON.parse(localStorage.getItem("gameData"));

      const updatedGameData = getUpdatedGameData(localGameData);

      const unFlippedCards = updatedGameData.cards.reduce((a, c) => {
        c.isFlipped = false;
        a.push(c);
        return a;
      }, []);

      updatedGameData.cards = unFlippedCards;

      setGameData(updatedGameData);
    }
  };

  useEffect(() => {
    getGameData();
  }, []);

  const handleCardUpdate = (cards) => {
    const newGameData = { ...gameData, cards: cards };
    const updatedGameData = getUpdatedGameData(newGameData);
    setGameData(updatedGameData);
    localStorage.setItem("gameData", JSON.stringify(newGameData));

    return updatedGameData;
  };

  const handleRestart = () => {
    localStorage.removeItem("gameData");
    setGameData({});
  };

  return (
    <>
      {gameData.cards ? (
        <GameBoard
          gameData={gameData}
          onCardUpdate={handleCardUpdate}
          onRestart={handleRestart}
        />
      ) : (
        <GameStart onDifficultySelection={difficultySelected} />
      )}
    </>
  );
}

export default App;
