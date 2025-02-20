import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, useMediaQuery } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import {
  useIsV2,
  useUDDomain,
  useWalletModalToggle,
} from 'state/application/hooks';
import {
  isTransactionRecent,
  useAllTransactions,
} from 'state/transactions/hooks';
import { TransactionDetails } from 'state/transactions/reducer';
import { shortenAddress, isSupportedNetwork } from 'utils';
import useENSName from 'hooks/useENSName';
import { WalletModal, NetworkSelectionModal } from 'components';
import { useActiveWeb3React } from 'hooks';
import QuickIcon from 'assets/images/quickIcon.svg';
import QuickLogo from 'assets/images/quickLogo.png';
import { ReactComponent as ThreeDotIcon } from 'assets/images/ThreeDot.svg';
// import { ReactComponent as LightIcon } from 'assets/images/LightIcon.svg';
import WalletIcon from 'assets/images/WalletIcon.png';
import NewTag from 'assets/images/NewTag.png';
import SparkleLeft from 'assets/images/SparkleLeft.svg';
import SparkleRight from 'assets/images/SparkleRight.svg';
import SparkleTop from 'assets/images/SparkleTop.svg';
import SparkleBottom from 'assets/images/SparkleBottom.svg';
import 'components/styles/Header.scss';
import { useTranslation } from 'react-i18next';
import { getConfig } from 'config/index';
import useDeviceWidth from 'hooks/useDeviceWidth';
import { USDC } from 'constants/v3/addresses';

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => {
  return b.addedTime - a.addedTime;
};

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { account } = useActiveWeb3React();
  const { ethereum } = window as any;
  const { ENSName } = useENSName(account ?? undefined);
  const { udDomain } = useUDDomain();
  const [openDetailMenu, setOpenDetailMenu] = useState(false);
  const [openNetworkSelectionModal, setOpenNetworkSelectionModal] = useState(
    false,
  );
  const theme = useTheme();
  const allTransactions = useAllTransactions();
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx: any) => !tx.receipt)
    .map((tx: any) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx: any) => tx.receipt)
    .map((tx: any) => tx.hash);
  const tabletWindowSize = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileWindowSize = useMediaQuery(theme.breakpoints.down('xs'));
  const toggleWalletModal = useWalletModalToggle();
  const deviceWidth = useDeviceWidth();
  const [headerClass, setHeaderClass] = useState('');

  const changeHeaderBg = () => {
    if (window.scrollY > 0) {
      setHeaderClass('bg-palette');
    } else {
      setHeaderClass('');
    }
  };

  useEffect(() => {
    changeHeaderBg();
    window.addEventListener('scroll', changeHeaderBg);
  }, []);

  const menuItemCountToShow = useMemo(() => {
    if (deviceWidth > 1540) {
      return 7;
    } else if (deviceWidth > 1430) {
      return 6;
    } else if (deviceWidth > 1260) {
      return 5;
    } else if (deviceWidth > 1080) {
      return 4;
    }
    return 3;
  }, [deviceWidth]);

  const { chainId } = useActiveWeb3React();
  const config = getConfig(chainId);
  const showSwap = config['swap']['available'];
  const showPool = config['pools']['available'];
  const showFarm = config['farm']['available'];
  const showLair = config['lair']['available'];
  const showConvert = config['convert']['available'];
  const showPredictions = config['predictions']['available'];
  const showAnalytics = config['analytics']['available'];
  const showLending = config['lending']['available'];
  const showGamingHub = config['gamingHub']['available'];
  const showLeaderboard = config['leaderboard']['available'];

  const menuItems = [];

  const swapCurrencyStr = useMemo(() => {
    if (!chainId) return '';
    return `&currency1=${USDC[chainId].address}`;
  }, [chainId]);

  if (showSwap) {
    menuItems.push({
      link: `/swap?currency0=ETH${swapCurrencyStr}`,
      text: t('swap'),
      id: 'swap-page-link',
    });
  }
  if (showPool) {
    menuItems.push({
      link: `/pools`,
      text: t('pool'),
      id: 'pools-page-link',
    });
  }
  if (showFarm) {
    menuItems.push({
      link: `/farm`,
      text: t('farm'),
      id: 'farm-page-link',
    });
  }
  if (showLair) {
    menuItems.push({
      link: '/dragons',
      text: t('dragonLair'),
      id: 'dragons-page-link',
    });
  }
  if (showGamingHub) {
    menuItems.push({
      link: '/gamehub',
      text: 'Gaming Hub',
      id: 'gamehub-page-link',
      isExternal: true,
      target: '_top',
      externalLink: process?.env?.REACT_APP_GAMEHUB_URL || '',
      isNew: true,
    });
  }
  if (showPredictions) {
    menuItems.push({
      link: '/predictions',
      text: 'Predictions',
      id: 'predictions-page-link',
      isExternal: true,
      externalLink: process?.env?.REACT_APP_PREDICTIONS_URL || '',
    });
  }
  if (showLeaderboard) {
    menuItems.push({
      link: '/leader-board',
      text: 'Leader Board',
      id: 'contest-page-link',
      isNew: true,
    });
  }
  if (showConvert) {
    menuItems.push({
      link: '/convert',
      text: t('convert'),
      id: 'convert-quick',
    });
  }
  if (showLending) {
    menuItems.push({
      link: '/lend',
      text: t('lend'),
      id: 'lend-page-link',
      isNew: true,
    });
  }
  if (showAnalytics) {
    menuItems.push({
      link: `/analytics`,
      text: t('analytics'),
      id: 'analytics-page-link',
    });
  }

  const outLinks: any[] = [
    // {
    //   link: '/',
    //   text: 'Governance',
    // },
    // {
    //   link: '/',
    //   text: 'Docs',
    // },
    // {
    //   link: '/',
    //   text: 'For Developers',
    // },
    // {
    //   link: '/',
    //   text: 'Help & Tutorials',
    // },
    // {
    //   link: '/',
    //   text: 'Knowledge Base',
    // },
    // {
    //   link: '/',
    //   text: 'News',
    // },
  ];

  const { updateIsV2 } = useIsV2();

  return (
    <Box className={`header ${tabletWindowSize ? '' : headerClass}`}>
      <NetworkSelectionModal
        open={openNetworkSelectionModal}
        onClose={() => setOpenNetworkSelectionModal(false)}
      />
      <WalletModal
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
      <Link to='/'>
        {/*<img*/}
        {/*  src={mobileWindowSize ? QuickIcon : QuickLogo}*/}
        {/*  alt='ZKDexLogo'*/}
        {/*  height={mobileWindowSize ? 40 : 60}*/}
        {/*/>*/}
      </Link>
      {!tabletWindowSize && (
        <Box className='mainMenu'>
          {menuItems.slice(0, menuItemCountToShow).map((val, index) => (
            <Link
              to={val.link}
              key={index}
              id={val.id}
              className={`menuItem ${
                pathname !== '/' && val.link.includes(pathname) ? 'active' : ''
              }`}
              onClick={() => {
                updateIsV2(false);
              }}
            >
              <small>{val.text}</small>
              {val.isNew && (
                <>
                  <img src={NewTag} alt='new menu' width={46} />
                  <img
                    className='menuItemSparkle menuItemSparkleLeft'
                    src={SparkleLeft}
                    alt='menuItem sparkle left'
                  />
                  <img
                    className='menuItemSparkle menuItemSparkleRight'
                    src={SparkleRight}
                    alt='menuItem sparkle right'
                  />
                  <img
                    className='menuItemSparkle menuItemSparkleBottom'
                    src={SparkleBottom}
                    alt='menuItem sparkle bottom'
                  />
                  <img
                    className='menuItemSparkle menuItemSparkleTop'
                    src={SparkleTop}
                    alt='menuItem sparkle top'
                  />
                </>
              )}
            </Link>
          ))}
          {menuItems.slice(menuItemCountToShow, menuItems.length).length >
            0 && (
            <Box display='flex' className='menuItem subMenuItem'>
              <ThreeDotIcon />
              <Box className='subMenuWrapper'>
                <Box className='subMenu'>
                  {menuItems
                    .slice(menuItemCountToShow, menuItems.length)
                    .map((val, index) => (
                      <Link
                        to={val.link}
                        key={index}
                        onClick={() => {
                          setOpenDetailMenu(false);
                          updateIsV2(false);
                        }}
                      >
                        <small>{val.text}</small>
                      </Link>
                    ))}
                  {outLinks.map((item, ind) => (
                    <a href={item.link} key={ind}>
                      <small>{item.text}</small>
                    </a>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      )}
      {tabletWindowSize && (
        <Box className='mobileMenuContainer'>
          <Box className='mobileMenu'>
            {menuItems.slice(0, 4).map((val, index) => (
              <Link
                to={val.link}
                key={index}
                className={
                  pathname.indexOf(val.link) > -1 ? 'active' : 'menuItem'
                }
              >
                <small>{val.text}</small>
              </Link>
            ))}
            {menuItems.length > 4 && (
              <Box className='flex menuItem'>
                <ThreeDotIcon
                  onClick={() => setOpenDetailMenu(!openDetailMenu)}
                />
                {openDetailMenu && (
                  <Box className='subMenuWrapper'>
                    <Box className='subMenu'>
                      {menuItems
                        .slice(4, menuItems.length)
                        .map((val, index) => {
                          return val.isExternal ? (
                            <a
                              href={val.externalLink}
                              target={val?.target ? val.target : '_blank'}
                              key={index}
                              rel='noopener noreferrer'
                            >
                              <small>{val.text}</small>
                            </a>
                          ) : (
                            <Link
                              to={val.link}
                              key={index}
                              onClick={() => {
                                setOpenDetailMenu(false);
                                updateIsV2(false);
                              }}
                            >
                              <small>{val.text}</small>
                            </Link>
                          );
                        })}
                      {outLinks.map((item, ind) => (
                        <a
                          href={item.link}
                          key={ind}
                          onClick={() => setOpenDetailMenu(false)}
                        >
                          <small>{item.text}</small>
                        </a>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
      <Box>
        <Box
          className='networkSelection'
          onClick={() => setOpenNetworkSelectionModal(true)}
        >
          {(!ethereum || isSupportedNetwork(ethereum)) && (
            <Box className='networkSelectionImage'>
              <Box className='styledPollingDot' />
              <img src={config['nativeCurrencyImage']} alt='network Image' />
            </Box>
          )}
          <small className='weight-600'>
            {ethereum && !isSupportedNetwork(ethereum)
              ? t('wrongNetwork')
              : config['networkName']}
          </small>
          <KeyboardArrowDown />
        </Box>
        {account && (!ethereum || isSupportedNetwork(ethereum)) ? (
          <Box
            id='web3-status-connected'
            className='accountDetails'
            onClick={toggleWalletModal}
          >
            <p>{udDomain ?? shortenAddress(account)}</p>
            <img src={WalletIcon} alt='Wallet' />
          </Box>
        ) : !ethereum || isSupportedNetwork(ethereum) ? (
          <Box
            className='connectButton bg-primary'
            onClick={() => {
              toggleWalletModal();
            }}
          >
            {t('connectWallet')}
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default Header;
