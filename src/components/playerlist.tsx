import { motion } from "framer-motion";
import React from "react";
import Player from "./player";
import styles from "./playerlist.module.scss";


class PlayerList extends React.Component<Props> {
    render(): React.ReactNode {
        const { players, currentPlayer, deletePlayer } = this.props;

        const container = {
            hidden: { opacity: 1, scale: 0 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    delayChildren: 0.3,
                    staggerChildren: 0.2
                }
            }
        };

        return (
            <motion.section
                className={styles.main}

                variants={container}
                initial="hidden"
                animate="visible"
            >
                {players.map((player, index) =>
                    <Player
                        key={player}
                        index={index}
                        player={player}
                        deletePlayer={deletePlayer}
                        allowDelete={players.length > 2}
                        active={currentPlayer === player}
                    />
                )}
            </motion.section>
        )
    }
}

interface Props {
    players: string[];
    currentPlayer: string;
    deletePlayer: (player: string) => void;
}

export default PlayerList;