// import React, { createContext, useContext } from "react";
// import PgSession from '../app/sessions/PgSession';

// interface SessionContextType {
//   session: PgSession;
// }

// const SessionContext = createContext<SessionContextType>({
//   session: new PgSession("222"),
// });

// export const useSession = () => useContext(SessionContext);

// export const SessionProvider: React.FC = ({ children }) => {
//   const session = new PgSession("222");

//   return (
//     <SessionContext.Provider value={{ session }}>
//       {children}
//     </SessionContext.Provider>
//   );
// };
