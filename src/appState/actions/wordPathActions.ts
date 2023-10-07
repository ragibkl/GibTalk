type ClearWordPathAction = {
  type: "clear-word-path";
};

type AddWordPathAction = {
  type: "add-word-path";
  wordId: string;
};

type PopWordPathAction = {
  type: "pop-word-path";
};

export type WordPathAction =
  | ClearWordPathAction
  | AddWordPathAction
  | PopWordPathAction;
