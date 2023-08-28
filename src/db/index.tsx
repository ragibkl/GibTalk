import {
  ReactNode,
  createContext,
  useReducer,
  Dispatch,
  useContext,
} from "react";

import { Word } from "../service/words";

import { Action } from "./actions";
import { DEFAULT_APP_STATE, AppState } from "./appSchema";
import { appStateReducer } from "./reducers";
import { useStorage } from "./storage";

export const AppStateContext = createContext<AppState>(DEFAULT_APP_STATE);
export const AppDispatchContext = createContext<Dispatch<Action>>(
  (_action) => {},
);

type AppStateProps = {
  children: ReactNode | ReactNode[];
};

export function AppStateProvider(props: AppStateProps) {
  const [appState, dispatch] = useReducer(appStateReducer, DEFAULT_APP_STATE);

  const setWords = (words: Word[]) => {
    dispatch({ type: "set-words", words });
  };

  const isLoadingWords = useStorage("words-key", appState.words, setWords);

  return (
    <AppStateContext.Provider value={appState}>
      <AppDispatchContext.Provider value={dispatch}>
        {isLoadingWords ? <></> : props.children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const appState = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);

  return {
    appState,
    dispatch,
  };
}
