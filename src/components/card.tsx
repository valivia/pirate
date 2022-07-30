import { processedCard } from "types/card";
import React from "react";
import styles from "./card.module.scss";

class Card extends React.Component<Props> {

    render() {
        const { card, preview, nextCard } = this.props;
        let cardStyle = {};
        card.background && (cardStyle = { ...cardStyle, backgroundImage: `url(${card.background}` });

        return (
            <article
                style={cardStyle}
                className={[styles.main, styles.noselect].join(" ")}
                onClick={nextCard}
            >
                {card.title && !preview && <h1>{card.title}</h1>}
                <p>{card.processedText}</p>
            </article>
        )
    }
}

interface Props {
    card: processedCard;
    preview: boolean;
    nextCard: () => void;
}

export default Card;