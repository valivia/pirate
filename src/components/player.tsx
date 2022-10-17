import { motion } from "framer-motion";
import styles from "./player.module.scss";

function Player({ index, player, active, allowDelete, deletePlayer }: Props) {

    const variants = {
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: -100 },
    };

    return (
        <motion.article
            className={styles.main}
            data-selected={active}

            transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.08 }}
            variants={variants}
        >
            <p>{player}</p>
            {
                (!active && allowDelete) ?
                    <button
                        onClick={() => deletePlayer(player)}
                        className={styles.delete}
                    >
                        <i className="material-icons">delete</i>
                    </button>
                    : <></>
            }
        </motion.article >
    )

}

interface Props {
    index: number;
    player: string;
    active: boolean;
    allowDelete: boolean;
    deletePlayer: (player: string) => void;
}

export default Player;