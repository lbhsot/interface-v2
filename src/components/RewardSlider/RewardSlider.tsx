import React, { useState, useEffect, useMemo } from 'react';
import Slider from 'react-slick';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {
  useStakingInfo,
  getBulkPairData,
  useDualStakingInfo,
} from 'state/stake/hooks';
import RewardSliderItem from './RewardSliderItem';
import { useActiveWeb3React } from 'hooks';
import { getOneYearFee } from 'utils';
import 'components/styles/RewardSlider.scss';
import { ChainId } from 'sdk/uniswap';
import { DEFAULT_CHAIN_ID } from '../../sdk/uniswap/constants';

const RewardSlider: React.FC = () => {
  const theme = useTheme();
  const { chainId } = useActiveWeb3React();
  const tabletWindowSize = useMediaQuery(theme.breakpoints.down('md'));
  const mobileWindowSize = useMediaQuery(theme.breakpoints.down('sm'));
  const chainIdOrDefault = chainId ?? DEFAULT_CHAIN_ID;
  const lprewardItems = useStakingInfo(chainIdOrDefault, null, 0, 2);
  const dualrewardItems = useDualStakingInfo(chainIdOrDefault, null, 0, 1);
  const [bulkPairs, setBulkPairs] = useState<any>(null);
  const rewardItemsCount = lprewardItems.length + dualrewardItems.length;

  const stakingPairListStr = useMemo(() => {
    return lprewardItems
      .map((item) => item.pair)
      .concat(dualrewardItems.map((item) => item.pair))
      .join(',');
  }, [dualrewardItems, lprewardItems]);

  const stakingPairLists = stakingPairListStr.split(',');

  useEffect(() => {
    const stakingPairLists = stakingPairListStr.split(',');
    if (stakingPairListStr) {
      getBulkPairData(chainIdOrDefault, stakingPairLists).then((data) =>
        setBulkPairs(data),
      );
    }
  }, [chainIdOrDefault, stakingPairListStr]);

  const stakingAPYs = useMemo(() => {
    if (bulkPairs && stakingPairLists.length > 0) {
      return stakingPairLists.map((pair) => {
        const oneDayVolume = bulkPairs[pair]?.oneDayVolumeUSD;
        const reserveUSD = bulkPairs[pair]?.reserveUSD;
        if (oneDayVolume && reserveUSD) {
          return getOneYearFee(oneDayVolume, reserveUSD);
        } else {
          return 0;
        }
      });
    } else {
      return [];
    }
  }, [bulkPairs, stakingPairLists]);

  const slideCount = mobileWindowSize ? 1 : tabletWindowSize ? 2 : 3;
  const slidesToShow = Math.min(slideCount, rewardItemsCount);

  const rewardSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    nextArrow: <ChevronRightIcon />,
    prevArrow: <ChevronLeftIcon />,
  };

  return (
    <Slider {...rewardSliderSettings} className='rewardsSlider'>
      {lprewardItems.map((item, index) => (
        <RewardSliderItem
          key={index}
          stakingAPY={stakingAPYs[index]}
          info={item}
        />
      ))}
      {dualrewardItems.map((item, index) => (
        <RewardSliderItem
          key={index}
          stakingAPY={stakingAPYs[index]}
          info={item}
        />
      ))}
    </Slider>
  );
};

export default React.memo(RewardSlider);
