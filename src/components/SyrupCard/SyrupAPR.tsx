import React from 'react';
import { Box } from '@material-ui/core';
import { SyrupInfo } from 'types';
import { CurrencyLogo } from 'components';
import { getTokenAPRSyrup } from 'utils';
import { useTranslation } from 'react-i18next';
import { useActiveWeb3React } from 'hooks';
import { ChainId } from 'sdk/uniswap';
import { OLD_DQUICK, OLD_QUICK } from 'constants/v3/addresses';
import { DEFAULT_CHAIN_ID } from '../../sdk/uniswap/constants';

const SyrupAPR: React.FC<{ syrup: SyrupInfo; dQUICKAPY: string }> = ({
  syrup,
  dQUICKAPY,
}) => {
  const { t } = useTranslation();
  const { chainId } = useActiveWeb3React();
  const chainIdToUse = chainId ? chainId : DEFAULT_CHAIN_ID;

  const isDQUICKStakingToken = syrup.stakingToken.equals(
    OLD_DQUICK[chainIdToUse],
  );

  return (
    <>
      <small className='text-success'>
        {getTokenAPRSyrup(syrup).toLocaleString('us')}%
      </small>
      {isDQUICKStakingToken && (
        <Box className='syrupAPR border-gray2'>
          <CurrencyLogo currency={OLD_QUICK[chainIdToUse]} size='12px' />
          <span style={{ marginLeft: 4 }}>
            {dQUICKAPY}% <span className='text-hint'>{t('apy')}</span>
          </span>
        </Box>
      )}
    </>
  );
};

export default SyrupAPR;
