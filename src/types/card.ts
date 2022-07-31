export interface Card {
  processedText: any;
  title: string | undefined;
  text: string;
  background: string | undefined;
  turns: number | undefined;
}

export interface processedCard {
  title: string | undefined;
  text: string;
  processedText: (string | JSX.IntrinsicElements["var"])[];

  background: string | undefined;
  turns: number;
}

export interface activeCard extends processedCard {
  player: string;
}
