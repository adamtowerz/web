import "../styles/globals.css";
import "../styles/animations.css";
import "../styles/Theme.scss";

import Deft from "../deft";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} /> <Deft />
    </div>
  );
}

export default MyApp;
