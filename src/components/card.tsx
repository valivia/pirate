import { processedCard } from "types/card";
import React, { ReactNode } from "react";
import styles from "./card.module.scss";

function CardComponent({ card, preview, onClick }: Props) {
  let cardStyle = {};

  card.has_image && (cardStyle = { backgroundImage: `url(/cards/${card.id}` });
  let text = card.processed_text;

  if (card.turns) {
    text = card.processed_text.map((substring) => {
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

interface Props {
  card: processedCard;
  preview: boolean;
  onClick: () => void;
}

export default CardComponent;
