const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    // random index from 0 to i
    let j = Math.floor(Math.random() * (i + 1));

    // swap elements array[i] and array[j] using destructuring assignment
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomCards = (numberOfCards) => {
  // generate array from 1 to numberOfCards
  const orderedCardArray = Array.from(
    { length: numberOfCards },
    (_, i) => i + 1
  );

  // shuffle two sets of cards
  return shuffle([...orderedCardArray, ...orderedCardArray]);
};

const getCrads = (difficulty) => {
  let cardsArray = [];
  switch (difficulty) {
    case "easy":
      cardsArray = getRandomCards(5);
      break;
    case "medium":
      cardsArray = getRandomCards(10);
      break;
    case "hard":
      cardsArray = getRandomCards(25);
      break;

    default:
      cardsArray = getRandomCards(5);
      break;
  }

  return cardsArray.reduce((a, c) => {
    a.push({ cardNum: c, isFlipped: false, isVisible: true });
    return a;
  }, []);
};

const startGame = (difficulty) => {
  const cards = getCrads(difficulty);
  const created_at = new Date();
  const error_score = 0;
  const elapsed_time = 0;
  const game_ended = false;
  const rating = 0;

  return {
    created_at,
    error_score,
    elapsed_time,
    game_ended,
    rating,
    cards,
  };
};

const ellapsedSeconds = (startTime) => {
  const currentTime = new Date();

  let timeDiff = currentTime - startTime; //in ms

  // strip the ms
  timeDiff /= 1000;

  // get seconds
  return Math.round(timeDiff);
};

const rating = ({ error_score, elapsed_time, cards }) => {
  const rating = (error_score * 60 + elapsed_time) / cards.length;

  let stars = 0;
  switch (true) {
    case rating <= 100:
      stars = 5;
      break;
    case rating <= 150:
      stars = 4;
      break;
    case rating <= 200:
      stars = 3;
      break;
    case rating <= 250:
      stars = 2;
      break;
    default:
      stars = 1;
  }

  return stars;
};

const getUpdatedGameData = (gameData) => {
  if (typeof gameData.created_at === "string") {
    gameData.created_at = new Date(gameData.created_at);
  }
  gameData.elapsed_time = ellapsedSeconds(gameData.created_at);

  const { cards } = gameData;

  const flippedCards = cards.reduce((a, c, i) => {
    if (c.isFlipped) {
      c.index = i;
      a.push(c);
    }
    return a;
  }, []);

  if (flippedCards.length !== 2) {
    return gameData;
    // throw new Error("There must be two cards selected only");
  }

  const [firstCrad, secondCard] = flippedCards;

  if (firstCrad.cardNum !== secondCard.cardNum) {
    gameData.error_score++;
  } else {
    gameData.cards[firstCrad.index].isVisible = false;
    gameData.cards[secondCard.index].isVisible = false;
  }

  const visibleCount = gameData.cards.reduce((a, c) => {
    a = c.isVisible ? a + 1 : a;
    return a;
  }, 0);

  // end game if all cards have been flipped
  if (visibleCount === 0) {
    gameData.game_ended = true;
    gameData.rating = rating(gameData);
  }

  return gameData;
};

export { startGame, getUpdatedGameData };
