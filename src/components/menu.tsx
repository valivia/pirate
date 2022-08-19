import React from "react";
import styles from "./menu.module.scss";

class Menu extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            input: ""
        };
    }

    render() {
        const { reset, shufflePlayers, openAddPlayer, addPlayer, showPlayers, isOpen, playersShown } = this.props;

        return (
            <section
                className={styles.main}
                data-addplayer={isOpen ? "true" : "false"}
                data-showplayers={playersShown ? "true" : "false"}
            >
                <section className={styles.buttons}>

                    <button
                        onClick={() => window.confirm("Are you sure you want to reset?") && reset()}
                        title="Reset"
                        className={styles.resetButton}
                    >
                        <i className="material-icons">arrow_back</i>
                    </button>

                    <button
                        onClick={shufflePlayers}
                        title="Shuffle"
                        className={styles.shuffleButton}
                    ><i className="material-icons">shuffle</i>
                    </button>

                    <button
                        onClick={showPlayers}
                        title="Show players"
                        className={styles.listButton}
                    ><i className="material-icons">group</i>
                    </button>

                    <button
                        onClick={openAddPlayer}
                        title="Add player"
                        className={styles.addButton}
                    ><i className="material-icons">person_add</i>
                    </button>

                </section>
                <section className={styles.addPlayer} data-state={isOpen ? "open" : "closed"}>
                    <input
                        type="text"
                        placeholder="Add player"
                        value={this.state.input}
                        onChange={(e) => this.setState({ input: e.currentTarget.value })}
                        onKeyUp={addPlayer}
                        ref={x => x && isOpen && x.focus()}
                    />
                </section>
            </section>
        )
    }
}

interface State {
    input: string;
}

interface Props {
    shufflePlayers: () => void;
    openAddPlayer: () => void;
    showPlayers: () => void;
    addPlayer: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    reset: () => void;
    isOpen: boolean;
    playersShown: boolean;
}

export default Menu;