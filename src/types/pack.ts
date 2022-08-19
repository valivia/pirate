import { Card } from "./card";

export interface cardPack {
    title: string;
    description: string;
    thumbnail: string;
    authors: string[];

    cards: Card[];
}