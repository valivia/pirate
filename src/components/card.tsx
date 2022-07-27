import React from "react";
import "./card.scss";

class Card extends React.Component<Props> {

    processText(text: string) {
        if (!text.match(/%Player[0-9]%/g)) return text;
        const currentIndex = this.props.players.indexOf(this.props.currentPlayer ?? this.props.players[0]);

        text = text.replace(/%NextPlayer%/g, this.props.players[(currentIndex + 1 >= this.props.players.length ? 0 : currentIndex + 1)]);
        text = text.replace(/%PreviousPlayer%/g, this.props.players[(currentIndex - 1 < 0 ? this.props.players.length - 1 : currentIndex - 1)]);

        let processing = true;
        let index = 1;
        let remainingPlayers = this.props.players;

        while (processing) {
            const regex = new RegExp(`%Player${index}%`, "g");
            const match = text.match(regex);
            index++;

            if (!match) {
                processing = false;
                break;
            }

            const player = this.props.players[Math.floor(Math.random() * this.props.players.length)];
            remainingPlayers = remainingPlayers.filter(p => p !== player);
            text = text.replace(regex, player);
        }

        return text;
    }


    render() {
        let card = this.props.card;
        card.text = this.processText(card.text);

        return (
            <section className="card">
                <article className="card">
                    <h1>{card.title}</h1>
                    <p>{card.text}</p>
                </article>
                <section>
                    <button onClick={this.props.nextCard}>Next</button>
                </section>
            </section>
        )
    }
}

interface Props {
    players: string[];
    currentPlayer: string | null;
    card: { title: string, text: string };
    nextCard: () => void;
}

export default Card;