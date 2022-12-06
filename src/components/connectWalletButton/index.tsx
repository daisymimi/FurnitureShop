import React from "react";
import { useWeb3React } from "@web3-react/core";
import { Button } from "@mui/material";
import { useEagerConnect } from "src/hooks/useEagerConnect";
import { useInactiveListener } from "src/hooks/useInactiveListener";
import { connectorsByName } from "src/utils/connectors";

const ConnectWalletButton = () => {
  const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const currentConnector = connectorsByName.injected;
  const activating = currentConnector === activatingConnector;
  const connected = currentConnector === connector;
  const disabled = !triedEager || !!activatingConnector || connected || !!error;

  return active ? (
    <Button sx={{ margin: 1 }} variant="contained">
      <p color="white">
        {account &&
          `${account.slice(0, 6)}...${account.slice(
            account.length - 4,
            account.length
          )}`}
      </p>
    </Button>
  ) : (
    // </Box>
    <Button
      sx={{ margin: 1 }}
      variant="contained"
      onClick={() => {
        setActivatingConnector(currentConnector);
        activate(currentConnector);
      }}
    >
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;
