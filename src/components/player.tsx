import React from "react";
import "./player.scss";

class Player extends React.Component<Props> {
    render() {
        return (
            <article className="player" data-selected={this.props.active}>
                <p>{this.props.player}</p>
                {(!this.props.active && this.props.allowDelete) ?
                    <button onClick={() => this.props.deletePlayer(this.props.player)}>
                        <i className="material-icons">delete</i>
                    </button>
                    : <></>}
            </article >
        )
    }
}

interface Props {
    player: string;
    active: boolean;
    allowDelete: boolean;
    deletePlayer: (player: string) => void;
}

export default Player;