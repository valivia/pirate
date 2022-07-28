import * as CardType from "types/card";
import React from "react";
import "./card.scss";
import { motion } from "framer-motion";

class Card extends React.Component<Props> {

    render() {
        let card = this.props.card;
        let cardStyle = {};
        card.background && (cardStyle = { ...cardStyle, backgroundImage: `url(${card.background}` });
        card.color && (cardStyle = { ...cardStyle, color: card.color });

        return (
            <motion.article
                key={card.text as string}

                drag
                initial={{ rotate: 90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 19
                }}

                className="card noselect"
                style={cardStyle}

                onClick={this.props.nextCard}
            >
                {card.title ? <h1>{card.title}</h1> : null}
                <p>{card.text}</p>
            </motion.article>
        )
    }
}

interface Props {
    card: CardType.default;
    nextCard: () => void;
}

export default Card;