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
        const { reset, shufflePlayers, openAddPlayer, addPlayer, isOpen } = this.props;

        return (
            <section className={styles.main} data-state={isOpen ? "open" : "closed"}>
                <section className={styles.buttons}>

                    <button
                        onClick={reset}
                        title="Reset"
                        id="reset"
                    >
                        <i className="material-icons">arrow_back</i>
                    </button>

                    <button
                        onClick={shufflePlayers}
                        title="Shuffle"
                        id="shuffle"
                    ><i className="material-icons">shuffle</i>
                    </button>

                    <button
                        onClick={() => null}
                        title="Show players"
                        id="playerList"
                    ><i className="material-icons">group</i>
                    </button>

                    <button
                        onClick={openAddPlayer}
                        title="Add player"
                        id="addPlayer"
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
    addPlayer: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    reset: () => void;
    isOpen: boolean;
}

export default Menu;