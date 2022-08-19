export interface Card {
  processedText: any;
  title: string | undefined;
  text: string;
  turns: number | undefined;

  id: string;
  hasImage: boolean;
}

export interface processedCard {
  title: string | undefined;
  text: string;
  processedText: (string | JSX.IntrinsicElements["var"])[];

  turns: number;

  id: string;
  hasImage: boolean;
}

export interface activeCard extends processedCard {
  player: string;
}
