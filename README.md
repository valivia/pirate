# ⚠️ Development for this project has been ended in favour of [a more dynamic card game](https://github.com/valivia/card_game) ⚠️


# card placeholders

Try not to use "you" to refer to the current player and instead use %SELF%,
this is to maintain consistency with the rest of the cards.

- `%NEXT_PLAYER%` The next player in the list.
- `%PREVIOUS_PLAYER%` The previous player in the list.
- `%PLAYER[0-9]%` reference up to 9 different random players.
- `%SELF%` The current player.
- `%TURNS%` Takes the number from `turns` and puts in `x turn(s)` (use -1 if you want it to last untill the user dismisses it).

# Card options

options with ? are optional.

- `title`?: The title of the card.
- `text`: The text to display.
- `background`?: The background image to display.
- `turns`?: how many turns the card lasts.

# example:

```json
{
  "title": "Hello",
  "text": "%SELF% has to drink with %NEXT_PLAYER%, %PLAYER1% and %PLAYER2% for %TURNS%.",
  "background": "https:/xxxxxxxxxxxxxx.png",
  "turns": 1
}
```
