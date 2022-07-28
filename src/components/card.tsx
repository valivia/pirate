import * as CardType from "types/card";
import React from "react";
import "./card.scss";

class Card extends React.Component<Props> {

    render() {
        let card = this.props.card;
        let cardStyle = {};
        card.background && (cardStyle = { ...cardStyle, backgroundImage: `url(${card.background}` });
        card.color && (cardStyle = { ...cardStyle, color: card.color });

        return (
            <article
                className="card noselect"
                style={cardStyle}
                onClick={this.props.nextCard}>
                {card.title ? <h1>{card.title}</h1> : null}
                <p>{card.text}</p>
            </article>
        )
    }
}

interface Props {
    card: CardType.default;
    nextCard: () => void;
}

export default Card;