import React from "react";
import styles from "./start.module.scss";

class Start extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            input: ""
        };
    }

    submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { input } = this.state;
        if (input.length < 1) return;
        this.props.addPlayer(input);
        this.setState({ input: "" });
    }

    render() {

        const { players, startGame } = this.props;

        return (
            <div className={styles.main}>
                <form onSubmit={this.submit} className={styles.menu}>
                    <h1>Add players</h1>
                    <input
                        type="text"
                        placeholder="Enter Player Name Here"
                        value={this.state.input}
                        autoCapitalize="on"
                        autoComplete="off"
                        onChange={(e) => this.setState({ input: e.currentTarget.value })}
                    />
                    <section>
                        <input
                            type="submit"
                            value="Add Player"
                        />

                        {players.length >= 2 && <button onClick={startGame}>Start Game</button>}
                    </section>
                </form>
            </div>
        )
    }
}

interface Props {
    players: string[];
    addPlayer: (player: string) => void;
    startGame: () => void;
}

interface State {
    input: string;
}

export default Start;