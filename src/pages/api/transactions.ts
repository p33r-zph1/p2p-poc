import type { NextApiRequest, NextApiResponse } from 'next';

import { ITransaction } from '@/components/Transactions/Transactions';

const transactions: ITransaction[] = [
  {
    status: 'crypto_escrow_confirm',
    details: {
      onChainStatus: 'PENDING',
      offChainStatus: 'PENDING',
      type: 'buy',
      payment: {
        currency: 'PHP',
        amount: 120.0,
      },
      order: {
        currency: 'USDT',
      },
    },
  },
  {
    status: 'matching',
    details: {
      onChainStatus: 'PENDING',
      offChainStatus: 'PENDING',
      type: 'buy',
      payment: {
        currency: 'PHP',
        amount: 120.0,
      },
      order: {
        currency: 'USDT',
      },
    },
  },
  {
    status: 'send_fiat_payment_proof',
    details: {
      onChainStatus: 'PENDING',
      offChainStatus: 'PENDING',
      type: 'buy',
      payment: {
        currency: 'PHP',
        amount: 120.0,
      },
      order: {
        currency: 'USDT',
      },
    },
  },
  {
    status: 'success',
    details: {
      onChainStatus: 'PENDING',
      offChainStatus: 'PENDING',
      type: 'buy',
      payment: {
        currency: 'PHP',
        amount: 120.0,
      },
      order: {
        currency: 'USDT',
      },
    },
  },
  {
    status: 'failed',
    details: {
      onChainStatus: 'PENDING',
      offChainStatus: 'PENDING',
      type: 'buy',
      payment: {
        currency: 'PHP',
        amount: 120.0,
      },
      order: {
        currency: 'USDT',
      },
    },
  },
];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await new Promise(res => setTimeout(res, 2000));
  return res.status(200).json({ message: 'Success', data: { transactions } });
}

export default handler;
