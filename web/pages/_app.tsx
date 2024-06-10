// import { SessionProvider } from "../contexts/SessionContext";
import "../app/globals.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
  // <SessionProvider>
  // <Component {...pageProps} />)
  // </SessionProvider>
}

export default MyApp;
