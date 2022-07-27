import React from "react";
import "./card.scss";

class Card extends React.Component<Props> {

    render() {
        let card = this.props.card;

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
    card: { title: string, text: string };
    nextCard: () => void;
}

export default Card;