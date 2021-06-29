import React, {
  createContext,
  Dispatch,
  FunctionComponent,
  useReducer,
  useContext,
} from 'react';
import { AppState, AppStateActions, appReducer, HistoryType } from './reducer';

export const AppContext = createContext(
  {} as [AppState, Dispatch<AppStateActions>]
);

export function useAppState() {
  return useContext(AppContext);
}
const getPrevHistory = () => {
  try {
    return JSON.parse(
      localStorage.getItem('SQL_HISTORY') ?? '[]'
    ) as HistoryType[];
  } catch (error) {
    return [];
  }
};

// eslint-disable-next-line react/prop-types
export const AppProvider: FunctionComponent = ({ children }) => {
  const { Provider } = AppContext;
  const history = getPrevHistory();

  return (
    <Provider value={useReducer(appReducer, { history: history ?? [] })}>
      {children}
    </Provider>
  );
};
