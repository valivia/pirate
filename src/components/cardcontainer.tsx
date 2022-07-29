import React from "react";
import { currentCard } from "types/card";
import Card from "./card";
import styles from "./cardcontainer.module.scss";

class CardContainer extends React.Component<Props> {
    render(): React.ReactNode {
        const { currentCard, currentPlayer, nextCard } = this.props;
        return (
            <section className={styles.main}>
                <h1 className={styles.turn}>{currentPlayer}'s turn</h1>
                {
                    currentCard.processed ?
                        <Card
                            card={currentCard}
                            nextCard={nextCard}
                        /> :
                        <div>Loading...</div>
                }
            </section>
        )
    }
}
interface Props {
    currentPlayer: string;
    currentCard: currentCard;
    activeCards: currentCard[];
    nextCard: () => void;
}


export default CardContainer;