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

    this.setState({ players });
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
    const newCard = this.state.cards[Math.floor(Math.random() * this.state.cards.length)];

    if (newCard === this.state.currentCard || newCard === this.state.previousCard) {
      this.nextCard();
      return;
    }

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
          <Card
            nextCard={this.nextCard}
            players={this.state.players}
            card={this.state.currentCard}
            currentPlayer={this.state.currentPlayer}
          />
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
