import React, { useRef, useState } from "react";
import styles from "./start.module.scss";

function Start({ players, addPlayer, startGame }: Props) {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.length < 1) return;
        addPlayer(value);
        setValue("")
        inputRef.current?.focus();
    }

    return (
        <div className={styles.main}>
            <form onSubmit={submit} className={styles.menu}>
                <h1>Add players</h1>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter Player Name Here"
                    value={value}
                    autoCapitalize="on"
                    autoComplete="off"
                    onChange={(e) => setValue(e.currentTarget.value)}
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

interface Props {
    players: string[];
    addPlayer: (player: string) => void;
    startGame: () => void;
}

export default Start;