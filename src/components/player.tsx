import { motion } from "framer-motion";
import React from "react";
import "./player.scss";

class Player extends React.Component<Props> {
    render() {

        const variants = {
            visible: { opacity: 1, x: 0 },
            hidden: { opacity: 0, x: -100 },
        };

        return (
            <motion.article
                className="player"
                data-selected={this.props.active}

                transition={{ type: "spring", stiffness: 260, damping: 20, delay: this.props.index * 0.08 }}
                variants={variants}
            >
                <p>{this.props.player}</p>
                {(!this.props.active && this.props.allowDelete) ?
                    <button onClick={() => this.props.deletePlayer(this.props.player)}>
                        <i className="material-icons">delete</i>
                    </button>
                    : <></>}
            </motion.article >
        )
    }
}

interface Props {
    index: number;
    player: string;
    active: boolean;
    allowDelete: boolean;
    deletePlayer: (player: string) => void;
}

export default Player;