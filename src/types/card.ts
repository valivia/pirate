export interface Card {
  id: string;

  title?: string;
  text: string;

  turns?: number;
  minimum_players?: number;
  maximum_players?: number;
  time_limit?: number;
  has_image: boolean;
  is_nsfw: boolean;

  parent_card?: string;
}

export interface processedCard extends Card {
  processed_text: (string | JSX.IntrinsicElements["var"])[];
}

export interface activeCard extends processedCard {
  player: string;
}
