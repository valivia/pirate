interface Card {
  title: string | undefined;
  text: string | (string | JSX.Element)[];
  background: string | undefined;
  color: string | undefined;
  duration: number;
}

export default Card;
