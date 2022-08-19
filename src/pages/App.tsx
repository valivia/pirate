import React from "react";
import { ReactNode } from "react";
import styles from "styles/App.module.scss";
import shuffle from "util/shuffle";

import Menu from "components/menu";
import PlayerList from "components/playerlist";
import CardContainer from "components/cardcontainer";

import { activeCard, Card, processedCard } from "types/card";
import { cardPack } from "types/pack";

import basePack from "cards/base1.pack.json";
import discordPack from "cards/discord.pack.json";
import Start from "components/start";

class App extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    // const players = ["Trinity", "Josh", "Armex", "Usyer", "Pigeon", "Cayde", "Kiwi", "Chépa", "johnas smithas", "Jason"]
    const cards = this.compileCardPack([basePack as cardPack, discordPack as cardPack])
    // Math.floor(0.85 * cards.length)

    this.state = {
      addPlayer: false,
      showPlayers: false,
      cards,
      players: [],
      previousCards: [],
      activeCards: [],
      currentCard: null as unknown as processedCard,
      currentPlayer: "",
      cardTimeout: 0,
    };
  }

  compileCardPack = (packs: cardPack[]): Card[] => {
    const cards = new Map<string, Card>();
    for (const pack of packs) {
      for (const card of pack.cards) {
        if (!card.text) continue;
        if (!card.id) continue;
        cards.set(card.id, card);
      }
    }
    return Array.from(cards, ([_, value]) => (value));
  }

  deletePlayer = (player: string) => {
    const players = this.state.players.filter((p) => p !== player);

    if (players.length < 2)
      return alert("You need at least 2 players to play");

    window.confirm(`Are you sure you want to delete ${player}?`) && this.setState({ players });
  }

  addPlayerKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key !== "Enter") return;
    this.addPlayer(e.currentTarget.value);
  }

  addPlayer = (player: string) => {
    if (!player) return;

    if (this.state.players.find(p => p.toLowerCase() === player.toLowerCase())) {
      alert("Player already exists");
      return;
    }

    const players = [player, ...this.state.players];
    this.setState({ players, addPlayer: false });
  }

  nextCard = () => {
    let cards = this.state.cards;
    let previousCards = this.state.previousCards;
    let activeCards = this.state.activeCards;
    let currentCard = this.state.currentCard;

    const currentIndex = this.state.players.indexOf(this.state.currentPlayer ?? this.state.players[0]);
    const currentPlayer = this.state.players[(currentIndex + 1) % this.state.players.length];


    activeCards = activeCards.map((card) => {
      card.turns--;
      if (card.turns > 0) return card
      else return null
    }).filter((card) => card !== null) as activeCard[];

    // Add to active cards
    if (currentCard.turns > 0) {
      const activeCard: activeCard = { ...currentCard, player: this.state.currentPlayer };
      activeCards.push(activeCard);

    }

    // Remove card from previouscards if there is too many.
    if (previousCards.length === this.state.cardTimeout) {
      cards.push(previousCards.shift()!);
    }

    // Add current card to previous cards.
    const previousCard = { ...currentCard };
    previousCards.push(previousCard);

    // Set new random card as current card.
    const newCardIndex = Math.floor(Math.random() * cards.length);
    const newCard = cards[newCardIndex];
    currentCard = this.processCard(newCard, currentPlayer);
    cards.splice(newCardIndex, 1);

    this.setState({ currentCard, previousCards, cards, currentPlayer, activeCards });
  }

  shufflePlayers = () => {
    const players = shuffle(this.state.players);
    this.setState({ players });
  }

  reset = () => {
    this.setState({
      previousCards: [],
      currentCard: {} as processedCard,
      currentPlayer: "",
      cards: [],
      players: [],
    });
  }

  processCard(card: Card, player: string = this.state.currentPlayer): processedCard {
    let text = card.text as string;
    let output = { ...card } as unknown as processedCard;

    const players = this.state.players;
    if (output.turns === undefined) output.turns = 0

    // Previous/next/current player
    const currentIndex = players.indexOf(player ?? players[0]);
    const nextIndex = (currentIndex + 1) % players.length;
    const prevIndex = (currentIndex + players.length - 1) % players.length;


    // Random players
    let randomPlayers: { name: string, placeholder: string }[] = [];
    const match = text.match(/%PLAYER[0-9]%/g);
    if (match) {
      const playerOptions = players.filter(p => p !== player);
      const uniquePlaceholders = Array.from(new Set([...match]));
      const names = [...playerOptions].sort(() => Math.random() - 0.5).splice(0, uniquePlaceholders.length);
      randomPlayers = names.map((x, y) => ({ name: x, placeholder: uniquePlaceholders[y] }))
    }


    // Replace placeholders
    const processedText = text.replace(/ /g, "~ ").split("~").map(substring => {
      if (substring.match(/%PREVIOUS_PLAYER%/)) return <> <var>{players[prevIndex]}</var></>;
      if (substring.match(/%NEXT_PLAYER%/)) return <> <var>{players[nextIndex]}</var></>;
      if (substring.match(/%SELF%/)) return <> <var><u>{player}</u></var></>;
      // if (substring.match(/%TURNS%/)) return <> <var id="turns">{output.turns}</var> {`turn${output.turns! > 1 ? "s" : ""}`}</>;

      if (substring.match(/%PLAYER[0-9]%/)) {
        const randomPlayer = randomPlayers.find(p => p.placeholder === substring.trim());

        if (randomPlayer) return <> <var>{randomPlayer.name}</var></>;
      }

      return substring;
    });

    return { ...output, processedText };
  }

  sceneHandler = () => {
    const {
      players,
      currentCard,
      activeCards,
      currentPlayer,
    } = this.state

    if (!currentCard || !currentPlayer) {
      return <Start
        players={players}
        addPlayer={this.addPlayer}
        startGame={this.start}
      />
    }

    return <CardContainer
      currentCard={currentCard}
      activeCards={activeCards}
      currentPlayer={currentPlayer}
      nextCard={this.nextCard}
    />
  }

  start = () => {
    const cards = this.state.cards;
    const current = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
    const currentPlayer = this.state.players[0];
    const currentCard = this.processCard(current, currentPlayer);
    this.setState({ currentCard, cards, currentPlayer, cardTimeout: Math.floor(0.85 * cards.length) });
  }


  render(): ReactNode {
    const {
      players,
      currentPlayer,
      addPlayer,
      showPlayers
    } = this.state;

    return (
      <main
        className={styles.main}
        data-showplayers={showPlayers ? "true" : "false"}
      >

        {players.length > 0 &&
          <section className={styles.sidebar}>

            <Menu
              shufflePlayers={this.shufflePlayers}
              openAddPlayer={() => this.setState({ addPlayer: !addPlayer })}
              showPlayers={() => this.setState({ showPlayers: !showPlayers })}
              addPlayer={this.addPlayerKey}
              reset={this.reset}

              isOpen={addPlayer}
              playersShown={showPlayers}
            />

            <PlayerList
              players={players}
              showPlayers={showPlayers}
              currentPlayer={currentPlayer}
              deletePlayer={this.deletePlayer}
            />
          </section>
        }

        <this.sceneHandler />
      </main >
    );
  }
}

interface State {
  players: string[];
  cards: Card[];
  currentCard: processedCard;
  previousCards: Card[];
  activeCards: activeCard[];
  currentPlayer: string;

  cardTimeout: number;

  addPlayer: boolean;
  showPlayers: boolean;
}

export default App;
