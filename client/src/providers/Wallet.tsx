import { createContext, useContext, useEffect, useState } from 'react';
import { web3auth } from '../clients/Web3Auth';
import { SolanaWallet } from '@web3auth/solana-provider';
import { getED25519Key } from '@toruslabs/openlogin-ed25519';
import { setAuthStatus } from '../Navigation/redux/slice/AuthSlice';
import { clearUser } from '../Navigation/redux/slice/UserSlice';
import { useDispatch } from 'react-redux';
import { useLazyGetMeQuery } from '../Navigation/redux/apis/userApi';

export type User = Awaited<ReturnType<typeof web3auth.getUserInfo>>;

type WalletUserHeaders = {
  Authorization: string;
  'public-address': string;
};

type SocialUserHeaders = {
  Authorization: string;
  'app-pub-key': string;
};

export type WalletContextType = {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  connected: boolean;
  wallet: SolanaWallet | null;
  account: string | null;
  userInfo: User | null;
  appPubKey: string | null;
  headers: WalletUserHeaders | SocialUserHeaders | null;
  setHeaders: React.Dispatch<React.SetStateAction<WalletUserHeaders | SocialUserHeaders | null>>;
};

const WalletContext = createContext<WalletContextType | null>({
  connect: () => Promise.resolve(false),
  disconnect: () => Promise.resolve(),
  connected: false,
  wallet: null,
  account: null,
  userInfo: null,
  appPubKey: null,
  headers: null,
  setHeaders: () => {},
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [appPubKey, setAppPubKey] = useState<string | null>(null);
  const [headers, setHeaders] = useState<WalletUserHeaders | SocialUserHeaders | null>(null);

  const [getMe] = useLazyGetMeQuery();

  const dispatch = useDispatch();

  const initWallet = async () => {
    if (web3auth.connected) {
      setConnected(true);

      if (web3auth.provider) {
        const token = await web3auth.authenticateUser();
        const solWallet = new SolanaWallet(web3auth.provider);

        setWallet(solWallet);

        const accounts = await solWallet.requestAccounts();

        setAccount(accounts[0]);

        if (web3auth.connectedAdapterName === 'openlogin') {
          // social login including email/phone login
          const userInfo_ = await web3auth.getUserInfo();

          setUserInfo(userInfo_);

          const _appPubKey = await initAppPubKey();

          setHeaders({
            Authorization: `Bearer ${userInfo_.idToken}`,
            'app-pub-key': _appPubKey!,
          });
        } else {
          // wallet login web3auth.connectedAdapterName = 'phantom' or 'torus-solana'
          setUserInfo(token);
          setAppPubKey(accounts[0]);
          
          setHeaders({
            Authorization: `Bearer ${token.idToken}`,
            'public-address': accounts[0],
          });
        }
      }
    }
  };

  const initAppPubKey = async () => {
    try {
      const app_scoped_privkey = await web3auth.provider?.request({
        method: 'solanaPrivateKey',
      });
      // console.log('app_scoped_privkey ===>', app_scoped_privkey)
      // @ts-expect-error - web3auth implementation in docs
      const ed25519Key = getED25519Key(Buffer.from(app_scoped_privkey.padStart(64, '0'), 'hex'));
      const app_pub_key = ed25519Key.pk.toString('hex');

      setAppPubKey(app_pub_key);

      return app_pub_key;
    } catch (error) {
      console.error(error);
    }
  };

  const connect = async () => {
    try {
      await web3auth.connect();

      initWallet();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const disconnect = async () => {
    try {
      await web3auth.logout();
    } catch (error) {
      console.error(error);
    }
    setWallet(null);
    setAccount(null);
    setConnected(false);

    dispatch(clearUser());
    dispatch(setAuthStatus(false));
  };

  useEffect(() => {
    if (account && userInfo?.idToken && appPubKey) {
      getMe({
        headers: {
          Authorization: `Bearer ${userInfo.idToken}`,
          'app-pub-key': appPubKey,
        },
      });
    }
    if (account && web3auth.connectedAdapterName !== 'openlogin' && userInfo?.idToken) {
      getMe({
        headers: {
          Authorization: `Bearer ${userInfo.idToken}`,
          'public-address': account,
        },
      });
    }
  }, [getMe, account, connected, userInfo, appPubKey]);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        const container = document.getElementById('w3a-parent-container');
        
        if (container) {
          container.style.setProperty('--app-gray-800', 'rgba(19,19,19,0.85)');
          container.style.setProperty('--app-gray-500', '#FF00FF');
          container.style.fontFamily = "'Kanit', sans-serif";
        }

        initWallet();
        // disconnect();
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    // Callback function to execute when mutations are observed
    const callback: MutationCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if ((node as Element).id == 'w3a-modal') {
              const web3modal = node as Element;
              web3modal.setAttribute(
                'style',
                'backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 200'
              );

              const web3modalInner = web3modal.firstChild as Element;
              web3modalInner.setAttribute(
                'style',
                "background-color: rgba(0,0,0,0.8) !important; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 2px solid #FFFFFF14; font-family: 'Kanit', sans-serif; color: white;"
              );

              // Find all child elements inside the web3modal node
              const children = web3modal.querySelectorAll('.w3ajs-external-toggle__button');
              // Iterate over the NodeList of children and set their font-family style
              children.forEach((child) => {
                (child as HTMLElement).style.background = 'linear-gradient(90deg, #BB38DC 0%, #FF00BF 100%)'; // Replace with the desired font-family
              });

              const allButtons = web3modal.querySelectorAll('button');
              allButtons.forEach((child) => {
                (child as HTMLElement).style.borderRadius = '1rem';
                (child as HTMLElement).style.borderWidth = '0px';
              });

              const secondaryButtons = web3modal.querySelectorAll('.t-btn-secondary');
              secondaryButtons.forEach((child) => {
                (child as HTMLElement).style.background = ' #FFFFFF1F';
                (child as HTMLElement).style.borderWidth = '0px';
              });

              const textXs = web3modal.querySelectorAll('.text-xs');
              textXs.forEach((child) => {
                (child as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
              });
            }
          });
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the document body for configured mutations
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    // Return a cleanup function that stops observing when the component unmounts
    return () => observer.disconnect();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connect,
        disconnect,
        connected,
        wallet,
        account,
        userInfo,
        appPubKey,
        headers,
        setHeaders,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }

  return context;
};
