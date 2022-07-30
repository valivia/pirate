import { activeCard, Card, processedCard } from "types/card";
import React from "react";
import { ReactNode } from "react";
import styles from "styles/App.module.scss";
import shuffle from "util/shuffle";
import cardsJson from "../cards.json";
import Menu from "components/menu";
import PlayerList from "components/playerlist";
import CardContainer from "components/cardcontainer";

import discordCards from "../cards/discord.pack.json";

class App extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    const players = ["Trinity", "Josh", "Armex", "Usyer", "Pigeon", "Cayde", "Kiwi", "Chépa", "johnas smithas", "Jason"]
    //const cards = cardsJson as Card[];
    const cards = discordCards.cards as Card[];

    this.state = {
      addPlayer: false,
      showPlayers: false,

      players,
      cards,
      previousCards: [],
      activeCards: [],
      currentCard: {} as processedCard,
      currentPlayer: players[0],
      cardTimeout: Math.floor(0.7 * cards.length),
    };
  }

  deletePlayer = (player: string) => {
    const players = this.state.players.filter((p) => p !== player);

    if (players.length < 2)
      return alert("You need at least 2 players to play");

    window.confirm(`Are you sure you want to delete ${player}?`) && this.setState({ players });
  }

  addPlayer = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key !== "Enter") return;

    const player = e.currentTarget.value;
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

    for (const card of activeCards) {
      console.log(`cardPlayer: ${card.player}\ncurrentPlayer: ${currentPlayer}\nequals: ${card.player === currentPlayer}\nduration: ${card.duration}`);
      if (card.player !== currentPlayer) continue;
      card.duration--;
      if (card.duration > 0) continue;
      activeCards.splice(activeCards.indexOf(card), 1)
      console.log({ activeCards });
    }

    // Add to active cards
    if (currentCard.duration > 0) {
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
      cards: cardsJson as Card[],
      players: [],
    });
  }

  processCard(card: Card, player: string = this.state.currentPlayer): processedCard {
    let text = card.text as string;
    let output = { ...card } as unknown as processedCard;

    const players = this.state.players;
    if (output.duration === undefined) output.duration = 0

    // Previous/next/current player
    const currentIndex = players.indexOf(player ?? players[0]);
    const nextIndex = (currentIndex + 1) % players.length;
    const prevIndex = (currentIndex + players.length - 1) % players.length;


    // Random players
    let randomPlayers: { name: string, placeholder: string }[] = [];
    const match = text.match(/%Player[0-9]%/g);
    if (match) {
      const playerOptions = players.filter(p => p !== player);
      const uniquePlaceholders = Array.from(new Set([...match]));
      const names = [...playerOptions].sort(() => Math.random() - 0.5).splice(0, uniquePlaceholders.length);
      randomPlayers = names.map((x, y) => ({ name: x, placeholder: uniquePlaceholders[y] }))
    }


    // Replace placeholders
    const processedText = text.replace(/ /g, "~ ").split("~").map(substring => {
      if (substring.match(/%PreviousPlayer%/)) return <> <var>{players[prevIndex]}</var></>;
      if (substring.match(/%NextPlayer%/)) return <> <var>{players[nextIndex]}</var></>;
      if (substring.match(/%Self%/)) return <> <var><u>{player}</u></var></>;
      if (substring.match(/%Rounds%/)) return <> <var>{output.duration}</var> {`round${output.duration! > 1 ? "s" : ""}`}</>;

      if (substring.match(/%Player[0-9]%/)) {
        const randomPlayer = randomPlayers.find(p => p.placeholder === substring.trim());
        console.log({ randomPlayer, substring });

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

    if (players.length > 3)
      return <CardContainer
        currentCard={currentCard}
        activeCards={activeCards}
        currentPlayer={currentPlayer}
        nextCard={this.nextCard}
      />
    else return <section className={styles.container}>You need at least 2 players to play</section>
  }

  componentDidMount() {
    const currentCard = this.processCard(this.state.cards[Math.floor(Math.random() * this.state.cards.length)]);
    if (this.state.currentCard.processedText === undefined) {
      this.setState({ currentCard });
    }
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

        <section className={styles.sidebar}>

          <Menu
            shufflePlayers={this.shufflePlayers}
            openAddPlayer={() => this.setState({ addPlayer: !addPlayer })}
            showPlayers={() => this.setState({ showPlayers: !showPlayers })}
            addPlayer={this.addPlayer}
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
