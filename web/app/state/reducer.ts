/* eslint-disable no-case-declarations */
import DbSession from "../sessions/DbSession";

export type HistoryType = {
  sql: string;
  status?: string;
  time: Date;
  uuid: number | string;
};

export interface AppState {
  session?: DbSession;
  history?: HistoryType[];
}

export type AppStateActions =
  | { type: "SET_SESSION"; payload: DbSession }
  | { type: "CLEAR_SESSION" }
  | { type: "SET_HISTORY"; payload: HistoryType[] }
  | { type: "ADD_HISTORY"; payload: HistoryType }
  | { type: "REMOVE_HISTORY"; payload: number }
  | { type: "CLEAR_HISTORY" }
  | { type: "test"; payload: DbSession };

export function appReducer(
  state: AppState = { history: [] },
  action: AppStateActions
): AppState {
  // console.log(action, state);
  switch (action.type) {
    case "SET_SESSION":
      return { ...state, session: action.payload };
    case "CLEAR_SESSION":
      return { ...state, session: undefined };
    case "SET_HISTORY":
      return { ...state, history: action.payload };
    case "ADD_HISTORY": {
      const history = state.history ?? [];
      const existingHistoryIndex = history.findIndex(
        (item) => item.sql === action.payload.sql
      );

      if (existingHistoryIndex !== -1) {
        const updatedHistory = history.map((item, index) =>
          index === existingHistoryIndex ? { ...item, time: new Date() } : item
        );

        return {
          ...state,
          history: updatedHistory,
        };
      } else {
        return {
          ...state,
          history: [action.payload, ...history],
        };
      }
    }
    case "REMOVE_HISTORY":
      const newHistory = [...(state.history ?? [])];
      newHistory?.splice(action.payload, 1);
      return {
        ...state,
        history: newHistory,
      };
    case "CLEAR_HISTORY":
      return {
        ...state,
        history: [],
      };
    default:
      return state;
  }
}
