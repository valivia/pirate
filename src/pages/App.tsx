import React, { useState } from "react";
import styles from "styles/App.module.scss";
import shuffle from "util/shuffle";

import Menu from "components/menu";
import PlayerList from "components/playerlist";
import CardContainerComponent from "components/cardcontainer";

import { activeCard, Card, processedCard } from "types/card";
import { cardPack } from "types/pack";

import basePack from "cards/base1.pack.json";
import discordPack from "cards/discord.pack.json";
import Start from "components/start";

const compileCardPack = (packs: cardPack[]): Card[] => {
  const cards = new Map<string, Card>();
  for (const pack of packs) {
    for (const card of pack.cards) {
      if (!card.text) continue;
      if (!card.id) continue;
      cards.set(card.id, card);
    }
  }
  return Array.from(cards, ([_, value]) => value);
};



function App() {
  const [cards, setCards] = useState(compileCardPack([
    basePack as cardPack,
    discordPack as cardPack,
  ]));
  const [players, setPlayers] = useState<string[]>([]);
  const [activeCards, setActiveCards] = useState<activeCard[]>([]);
  const [previousCards, setPreviousCards] = useState<Card[]>([]);
  const [cardTimeout, setCardTimeout] = useState(0);

  const [currentCard, setCurrentCard] = useState<processedCard | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState("");

  const [isAddPlayers, setAddPlayers] = useState(false);
  const [isShowPlayers, setShowPlayers] = useState(false);

  // Players
  const deletePlayer = (player: string) => {
    if (players.length < 2) return alert("You need at least 2 players to play");

    window.confirm(`Are you sure you want to delete ${player}?`) &&
      setPlayers(old => old.filter((p) => p !== player));
  };

  const addPlayerKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key !== "Enter") return;
    addPlayer(e.currentTarget.value);
  };

  const addPlayer = (player: string) => {
    if (!player) return;

    if (players.some((p) => p.toLowerCase() === player.toLowerCase())) {
      alert("Player already exists");
      return;
    }

    setPlayers(old => [...old, player]);
    setAddPlayers(false);
  };

  // Cards
  const processCard = (
    card: Card,
    player: string = currentPlayer
  ): processedCard => {
    let text = card.text as string;
    let output = { ...card } as unknown as processedCard;

    if (output.turns === undefined) output.turns = 0;

    // Previous/next/current player
    const currentIndex = players.indexOf(player ?? players[0]);
    const nextIndex = (currentIndex + 1) % players.length;
    const prevIndex = (currentIndex + players.length - 1) % players.length;

    // Random players
    let randomPlayers: { name: string; placeholder: string }[] = [];
    const match = text.match(/%PLAYER[0-9]%/g);

    if (match) {
      const playerOptions = players.filter((p) => p !== player);
      const uniquePlaceholders = Array.from(new Set([...match]));
      const names = [...playerOptions]
        .sort(() => Math.random() - 0.5)
        .splice(0, uniquePlaceholders.length);
      randomPlayers = names.map((x, y) => ({
        name: x,
        placeholder: uniquePlaceholders[y],
      }));
    }

    // Replace placeholders
    const processed_text = text
      .replace(/ /g, "~ ")
      .split("~")
      .map((substring) => {
        if (substring.match(/%PREVIOUS_PLAYER%/))
          return (
            <>
              {" "}
              <var>{players[prevIndex]}</var>
            </>
          );
        if (substring.match(/%NEXT_PLAYER%/))
          return (
            <>
              {" "}
              <var>{players[nextIndex]}</var>
            </>
          );
        if (substring.match(/%SELF%/))
          return (
            <>
              {" "}
              <var>
                <u>{player}</u>
              </var>
            </>
          );

        if (substring.match(/%PLAYER[0-9]%/)) {
          const randomPlayer = randomPlayers.find(
            (p) => p.placeholder === substring.trim()
          );

          if (randomPlayer)
            return (
              <>
                {" "}
                <var>{randomPlayer.name}</var>
              </>
            );
        }

        return substring;
      });

    return { ...output, processed_text };
  }

  const nextCard = () => {
    const player = currentPlayer ?? players[0];
    const currentIndex = players.indexOf(player);
    const newCurrentPlayer =
      players[(currentIndex + 1) % players.length];

    setActiveCards(old => {
      // Filter expired active cards.
      const newArray = old.map((card) => {
        if (card.turns === 1) return null;
        if (card.turns === -1) return card;
        card.turns!--;
        return card;
      })
        .filter((card) => card !== null) as activeCard[];

      // Add to active cards
      if (currentCard && currentCard.turns !== 0) {
        const activeCard: activeCard = {
          ...currentCard,
          player: newCurrentPlayer,
        };
        newArray.push(activeCard);
      }

      return newArray;
    })

    const newCards = [...cards];
    const newPreviousCards = [...previousCards];

    // Remove card from previouscards if there is too many.
    if (newPreviousCards.length === cardTimeout)
      newCards.push(newPreviousCards.shift()!);


    // Add current card to previous cards.
    const previousCard = { ...currentCard } as processedCard;
    newPreviousCards.push(previousCard);

    // Set new random card as current card.
    const newCardIndex = Math.floor(Math.random() * newCards.length);
    const newCard = newCards[newCardIndex];
    newCards.splice(newCardIndex, 1);


    setPreviousCards(newPreviousCards);
    setCurrentPlayer(newCurrentPlayer);
    setCards(newCards);
    setCurrentCard(processCard(newCard, newCurrentPlayer));
  };

  const deleteCard = (id: string) => setActiveCards(old => old.filter((card) => card.id !== id));

  const shufflePlayers = () => setPlayers(old => shuffle(old));

  // Other 
  const reset = () => {
    setPreviousCards([]);
    setCurrentCard(null);
    setCurrentPlayer("");
    setPlayers([]);
    setCards(compileCardPack([
      basePack as cardPack,
      discordPack as cardPack,
    ]))
  };


  const start = () => {
    let newCards = cards.concat([]);
    const newCurrentCard = processCard(
      newCards.splice(Math.floor(Math.random() * cards.length), 1)[0],
      players[0]
    )

    setCurrentPlayer(players[0]);
    setCardTimeout(Math.floor(0.85 * cards.length));
    setCurrentCard(newCurrentCard);
    setCards(newCards);
  }

  return (
    <main
      className={styles.main}
      data-showplayers={isShowPlayers ? "true" : "false"}
    >
      {players.length > 0 && (
        <section className={styles.sidebar}>
          <Menu
            shufflePlayers={shufflePlayers}
            openAddPlayer={() => setAddPlayers(x => !x)}
            showPlayers={() => setShowPlayers(x => !x)}
            addPlayer={addPlayerKey}
            reset={reset}
            isOpen={isAddPlayers}
            playersShown={isShowPlayers}
          />

          <PlayerList
            players={players}
            showPlayers={isShowPlayers}
            currentPlayer={currentPlayer}
            deletePlayer={deletePlayer}
          />
        </section>
      )}

      {(!currentCard || !currentPlayer) ?
        <Start
          players={players}
          addPlayer={addPlayer}
          startGame={start}
        /> :
        <CardContainerComponent
          currentCard={currentCard}
          activeCards={activeCards}
          currentPlayer={currentPlayer}
          nextCard={nextCard}
          deleteCard={deleteCard}
        />
      }
    </main>
  );

}

export default App;
