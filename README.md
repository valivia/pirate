# card placeholders

Try not to use "you" to refer to the current player and instead use %self%,
this is to maintain consistency with the rest of the cards.

- `%NextPlayer%` The next player in the list.
- `%PreviousPlayer%` The previous player in the list.
- `%Player[0-9]%` reference up to 9 different random players.
- `%Self%` The current player.
- `%Turns%` Takes the number from `turns` and puts in `x turn(s)`.

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
  "text": "%Self% has to drink with %NextPlayer%, %Player1% and %Player2% for %Turns%.",
  "background": "https:/xxxxxxxxxxxxxx.png",
  "turns": 1
}
```