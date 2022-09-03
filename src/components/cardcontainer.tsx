import { motion } from "framer-motion";
import React from "react";
import { activeCard, processedCard } from "types/card";
import Card from "./card";
import styles from "./cardcontainer.module.scss";

class CardContainer extends React.Component<Props> {
    render(): React.ReactNode {
        const { currentCard, currentPlayer, activeCards, nextCard, deleteCard } = this.props;
        return (
            <section className={styles.main}>
                <h1 className={styles.turn}>{currentPlayer}'s turn</h1>
                {
                    currentCard.processedText ?
                        <motion.section
                            className={styles.mainCard}

                            key={currentCard.text}
                            initial={{ rotate: 90, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 19
                            }}>
                            <Card
                                preview={false}
                                card={currentCard}
                                onClick={nextCard}
                            />
                        </motion.section> :
                        <div>Loading...</div>
                }
                <section className={styles.activeCards}>
                    {activeCards.map((card, index) => (
                        <motion.div
                            className={styles.activeCard}

                            key={card.text}
                            initial={{ translateX: -100, opacity: 0 }}
                            animate={{ translateX: 0, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 19
                            }}
                        >
                            <Card
                                preview={true}
                                key={index}
                                card={card}
                                onClick={() => deleteCard(card.id)}
                            />
                        </motion.div>
                    ))}
                </section>
            </section>
        )
    }
}
interface Props {
    currentPlayer: string;
    currentCard: processedCard;
    activeCards: activeCard[];
    nextCard: () => void;
    deleteCard: (x: string) => void;
}


export default CardContainer;