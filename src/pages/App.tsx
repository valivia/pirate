import Card from "components/card";
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
      cards,
      previousCard: null,
      currentCard: cards[0],
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

    if (newCard === this.state.currentCard || newCard === this.state.previousCard) {
      this.nextCard();
      return;
    }

    newCard = this.processCard(newCard)

    const currentIndex = this.state.players.indexOf(this.state.currentPlayer ?? this.state.players[0]);
    const newPlayer = currentIndex >= this.state.players.length - 1 ? 0 : currentIndex + 1;
    this.setState({ currentCard: newCard, currentPlayer: this.state.players[newPlayer] });
  }

  reset = () => {
    this.setState({
      previousCard: null,
      currentCard: this.state.cards[0],
      currentPlayer: null,
      cards,
      players: [],
    });
  }

  processCard(card: typeof cards[number]) {
    let text = card.text;


    // Replace all random player placeholders with names (Credit to Tetrovolt)
    const match = text.match(/%Player[0-9]%/g);
    if (match) {
      const uniquePlaceholders = new Set([...match]);
      const names = [...this.state.players].sort(() => Math.random() - 0.5).splice(0, uniquePlaceholders.size);
      for (const placeholder of uniquePlaceholders) {
        text = text.replace(placeholder, names.pop()!);
      }
    }

    // Previous/next player
    const currentIndex = this.state.players.indexOf(this.state.currentPlayer ?? this.state.players[0]);
    const nextPlayerIndex = (currentIndex + 1) % this.state.players.length;
    const PreviousPlayerIndex = (currentIndex - 1) % this.state.players.length;

    text = text.replace(/%NextPlayer%/g, this.state.players[nextPlayerIndex]);
    text = text.replace(/%PreviousPlayer%/g, this.state.players[PreviousPlayerIndex]);


    return { ...card, text };
  }


  render(): ReactNode {

    return (
      <main>

        <section className="sidebar">
          <section className="menu">
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
            {this.state.addPlayer &&
              <section className="addPlayer">
                <input
                  type="text"
                  id="add-player"
                  placeholder="Add player"
                  onKeyUp={this.addPlayer}
                  ref={x => x && x.focus()}
                />
              </section>
            }
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
  cards: typeof cards;
  currentCard: typeof cards[number];
  previousCard: typeof cards[number] | null;
  currentPlayer: string | null;
  addPlayer: boolean;
}

export default App;
