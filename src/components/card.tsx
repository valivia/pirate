import { processedCard } from "types/card";
import React, { ReactNode } from "react";
import styles from "./card.module.scss";

class Card extends React.Component<Props> {
  render() {
    const { card, preview, onClick } = this.props;
    let cardStyle = {};

    card.hasImage && (cardStyle = { backgroundImage: `url(/cards/${card.id}` });
    let text = card.processedText;

    if (card.turns) {
      text = card.processedText.map((substring) => {
        if (typeof substring !== "string") return substring;
        if (!substring.match(/%TURNS%/g)) return substring;
        return (
          <>
            {" "}
            <var id="turns">{card.turns}</var>{" "}
            {`turn${card.turns! > 1 ? "s" : ""}`}
          </>
        );
      });
    }

    return (
      <article
        key={`${card.text}${card.turns}`}
        style={cardStyle}
        className={[styles.main, styles.noselect].join(" ")}
        onClick={onClick}
      >
        {card.title && !preview && <h1>{card.title}</h1>}
        <p>{text as string | ReactNode}</p>
      </article>
    );
  }
}

interface Props {
  card: processedCard;
  preview: boolean;
  onClick: () => void;
}

export default Card;
