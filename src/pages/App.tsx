import Card from "components/card";
import * as CardType from "types/card";
import Player from "components/player";
import React from "react";
import { ReactNode } from "react";
import "styles/App.scss";
import shuffle from "util/shuffle";
import cards from "../cards.json";

class App extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    const players = ["Trinity", "Josh", "Armex", "Usyer", "Pigeon", "Cayde", "Kiwi", "Chépa", "johnas smithas", "Jason"]

    this.state = {
      addPlayer: false,
      players,
      cards: cards as CardType.default[],
      previousCard: [],
      currentCard: cards[0] as CardType.default,
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

    const players = [...this.state.players, player];
    this.setState({ players, addPlayer: false });
  }

  nextCard = () => {
    let newCard = this.state.cards[Math.floor(Math.random() * this.state.cards.length)];

    if (newCard === this.state.currentCard) {
      this.nextCard();
      return;
    }


    const currentIndex = this.state.players.indexOf(this.state.currentPlayer ?? this.state.players[0]);
    const newPlayer = this.state.players[(currentIndex + 1) % this.state.players.length];

    newCard = this.processCard(newCard, newPlayer);

    this.setState({ currentCard: newCard, currentPlayer: newPlayer });
  }

  reset = () => {
    this.setState({
      previousCard: [],
      currentCard: this.state.cards[0],
      currentPlayer: "",
      cards: cards as CardType.default[],
      players: [],
    });
  }

  processCard(card: CardType.default, player: string = this.state.currentPlayer): CardType.default {
    let text = card.text as string;
    const players = this.state.players;

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
    const newText = text.replace(/ /g, ", ").split(",").map(substring => {
      if (substring.match(/%PreviousPlayer%/)) return <var> {players[prevIndex]}</var>;
      if (substring.match(/%NextPlayer%/)) return <var> {players[nextIndex]}</var>;
      if (substring.match(/%Self%/)) return <var><u> {player}</u></var>;
      if (substring.match(/%Rounds%/)) return <><var> {card.duration}</var> {`round${card.duration > 1 ? "s" : ""}`}</>;

      if (substring.match(/%Player[0-9]%/)) {
        const randomPlayer = randomPlayers.find(p => p.placeholder === substring.trim());
        console.log({ randomPlayer, substring });

        if (randomPlayer) return <var> {randomPlayer.name}</var>;
      }

      return substring;
    });

    return { ...card, text: newText };
  }


  render(): ReactNode {

    return (
      <main>

        <section className="sidebar">

          <section className="menu" data-state={this.state.addPlayer ? "open" : "closed"}>
            <section className="buttons">

              <button
                onClick={this.reset}
                title="Reset"
              >
                <i className="material-icons">arrow_back</i>
              </button>

              <button
                onClick={() => this.setState({ players: shuffle(this.state.players) })}
                title="Shuffle"
              ><i className="material-icons">shuffle</i>
              </button>

              <button
                onClick={() => this.setState({ addPlayer: !this.state.addPlayer })}
                title="Add player"
              ><i className="material-icons">person_add</i>
              </button>

            </section>
            <section className="addPlayer" data-state={this.state.addPlayer ? "open" : "closed"}>
              <input
                type="text"
                id="add-player"
                placeholder="Add player"
                onKeyUp={this.addPlayer}
                ref={x => x && x.focus()}
              />
            </section>
          </section>
          <section className="players">
            {this.state.players.map(player =>
              <Player
                key={player}
                player={player}
                deletePlayer={this.deletePlayer}
                allowDelete={this.state.players.length > 2}
                active={this.state.currentPlayer === player}
              />
            )}
          </section>
        </section>

        <section className="main">
          <Card card={this.state.currentCard} nextCard={this.nextCard} />
        </section>

      </main >
    );
  }
}

interface State {
  players: string[];
  cards: CardType.default[];
  currentCard: CardType.default;
  previousCard: CardType.default[];
  currentPlayer: string;
  addPlayer: boolean;
}

export default App;
