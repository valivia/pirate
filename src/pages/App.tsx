import { Card, currentCard, processedCard } from "types/card";
import React from "react";
import { ReactNode } from "react";
import styles from "styles/App.module.scss";
import shuffle from "util/shuffle";
import cards from "../cards.json";
import Menu from "components/menu";
import PlayerList from "components/playerlist";
import CardContainer from "components/cardcontainer";

class App extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    const players = ["Trinity", "Josh", "Armex", "Usyer", "Pigeon", "Cayde", "Kiwi", "Chépa", "johnas smithas", "Jason"]

    this.state = {
      addPlayer: false,
      showPlayers: false,

      players,
      cards: cards as Card[],
      previousCards: [],
      activeCards: [],
      currentCard: { raw: cards[Math.floor(Math.random() * cards.length)] } as currentCard,
      currentPlayer: players[0],
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
    let currentCard = this.state.currentCard;

    const currentIndex = this.state.players.indexOf(this.state.currentPlayer ?? this.state.players[0]);
    const currentPlayer = this.state.players[(currentIndex + 1) % this.state.players.length];

    // Remove card from previouscards if there is too many.
    if (previousCards.length === 18) {
      cards.push(previousCards.shift()!);
    }

    // Add current card to previous cards.
    previousCards.push(currentCard.raw);

    // Set new random card as current card.
    const newCardIndex = Math.floor(Math.random() * cards.length);
    currentCard.raw = this.state.cards[newCardIndex];
    currentCard.processed = this.processCard(currentCard.raw, currentPlayer);
    cards = cards.filter((_, i) => i !== newCardIndex);

    this.setState({ currentCard, previousCards, cards, currentPlayer, });
  }

  shufflePlayers = () => {
    const players = shuffle(this.state.players);
    this.setState({ players });
  }

  reset = () => {
    this.setState({
      previousCards: [],
      currentCard: { raw: cards[0] as Card } as currentCard,
      currentPlayer: "",
      cards: cards as Card[],
      players: [],
    });
  }

  processCard(card: Card, player: string = this.state.currentPlayer): processedCard {
    let text = card.text as string;
    const players = this.state.players;
    if (card.duration === undefined) card.duration = 0

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
    const newText = text.replace(/ /g, "~ ").split("~").map(substring => {
      if (substring.match(/%PreviousPlayer%/)) return <> <var>{players[prevIndex]}</var></>;
      if (substring.match(/%NextPlayer%/)) return <> <var>{players[nextIndex]}</var></>;
      if (substring.match(/%Self%/)) return <> <var><u>{player}</u></var></>;
      if (substring.match(/%Rounds%/)) return <> <var>{card.duration}</var> {`round${card.duration! > 1 ? "s" : ""}`}</>;

      if (substring.match(/%Player[0-9]%/)) {
        const randomPlayer = randomPlayers.find(p => p.placeholder === substring.trim());
        console.log({ randomPlayer, substring });

        if (randomPlayer) return <> <var>{randomPlayer.name}</var></>;
      }

      return substring;
    });

    return { ...card, text: newText };
  }

  sceneHandler = () => {
    const {
      players,
      currentCard,
      activeCards,
      currentPlayer,
      showPlayers
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
    if (this.state.currentCard.processed === undefined) {
      this.setState({
        currentCard: {
          ...this.state.currentCard,
          processed: this.processCard(this.state.currentCard.raw)
        }
      });
    }
  }

  render(): ReactNode {
    const {
      players,
      currentCard,
      activeCards,
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
  currentCard: currentCard;
  previousCards: Card[];
  activeCards: currentCard[];
  currentPlayer: string;

  addPlayer: boolean;
  showPlayers: boolean;
}

export default App;
