/* eslint-disable global-require */
import { StyledEngineProvider } from "@mui/material/styles";
import { FC } from "react";
import { Provider } from "react-redux";
import { HashRouter, BrowserRouter } from "react-router-dom";
import App from "src/App";
import { wagmiClient } from "src/hooks/wagmi";
import { ReactQueryProvider } from "src/lib/react-query";
import store from "src/store";
import { WagmiConfig } from "wagmi";

const Root: FC = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ReactQueryProvider>
        <Provider store={store}>
          <BrowserRouter>
            <StyledEngineProvider injectFirst>
              <App />
            </StyledEngineProvider>
          </BrowserRouter>
        </Provider>
      </ReactQueryProvider>
    </WagmiConfig>
  );
};

export default Root;
