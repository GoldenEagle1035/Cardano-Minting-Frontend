import { Blockfrost, Lucid, C as LCore } from 'lucid-cardano';

export const blockFrost = new Blockfrost(
  process.env.REACT_APP_BLOCKFROST_API_URL,
  process.env.REACT_APP_BLOCKFROST_API_KEY,
)

export const lucid_user = await Lucid.new(
  blockFrost,
  process.env.REACT_APP_CADANO_NETWORK == 0 ? 'Testnet' : 'Mainnet'
)

export const waitForTransaction = async (label, txHash) => {
  await blockFrost.awaitTx(txHash)
}

export const createMintingPolicy = async () => {
  const wallet = lucid_user.wallet

  const { paymentCredential } = lucid_user.utils.getAddressDetails(
    await wallet.address(),
  )

  const script = lucid_user.utils.nativeScriptFromJson({
    type: 'all',
    scripts: [
      { type: 'sig', keyHash: paymentCredential.hash },
      {
        type: 'before',
        slot: lucid_user.utils.unixTimeToSlot(Date.now() + 1000000),
      },
    ],
  })

  const policyId = lucid_user.utils.mintingPolicyToId(script)

  return {
    policyScript: script,
    policyId: policyId,
  }
}