import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { connectorsByName } from '../utils/connectors';

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const { injected } = connectorsByName;

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate, injected]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
