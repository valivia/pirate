import { Card } from "./card";

export interface cardPack {
    id: string;

    title: string;
    description: string;
    authors: string[];

    has_banner: boolean;
    is_official: boolean;

    cards: Card[];
}