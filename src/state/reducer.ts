import DbSession from '../sessions/DbSession';

export type HistoryType = {
  sql: string;
  status?: string;
  time: Date;
};

export interface AppState {
  session?: DbSession;
  history?: HistoryType[];
}

export type AppStateActions =
  | { type: 'SET_SESSION'; payload: DbSession }
  | { type: 'SET_HISTORY'; payload: HistoryType[] }
  | { type: 'ADD_HISTORY'; payload: HistoryType }
  | { type: 'test'; payload: DbSession };

export function appReducer(
  state: AppState = { history: [] },
  action: AppStateActions
): AppState {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'ADD_HISTORY':
      if (action?.payload?.sql === state?.history?.[0]?.sql) return state;
      return {
        ...state,
        history: [action.payload, ...(state?.history ?? [])],
      };
    default:
      return state;
  }
}
