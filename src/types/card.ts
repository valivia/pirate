export interface Card {
  processedText: any;
  title: string | undefined;
  text: string;
  background: string | undefined;
  duration: number | undefined;
}

export interface processedCard {
  title: string | undefined;
  text: string;
  processedText: (string | JSX.Element)[];

  background: string | undefined;
  duration: number;
}

export interface activeCard extends processedCard {
  player: string;
}
