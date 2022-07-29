export interface Card {
  title: string | undefined;
  text: string;
  background: string | undefined;
  color: string | undefined;
  duration: number | undefined;
}

export interface processedCard extends Omit<Card, "text"> {
  text: (string | JSX.Element)[];
}

export interface currentCard {
  raw: Card;
  processed: processedCard;
}
