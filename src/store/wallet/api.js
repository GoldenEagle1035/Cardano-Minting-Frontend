
import { lucid_user, createMintingPolicy, blockFrost } from '../../cardano/market-api/helper'

import { multiMintNFT } from "../../cardano/market-api";

import Wallet from "../../cardano/wallet";

import {
  walletCardanoConnected,
  walletCardanoDisconnected,
  setWalletLoading,
} from "./walletActions";
import { WALLET_STATE } from "./walletTypes";

export const mintNFT = (collection, mint_count, callback) => async (dispatch) => {
  
  const { policyId, policyScript } = await createMintingPolicy()

  let price = collection.Price * mint_count;
  if (collection.FeeType == "Fixed") price += collection.Fee * mint_count;
  
  let res = await dispatch(multiMintNFT({ policyId, policyScript }, collection, mint_count, price));
  
  if(res.error) callback({success: false, error: res.error});
  else callback({ success: true });
}

export const availableWallets = (callback) => async (dispatch) => {
  
  callback({
    success: true,
    wallets: await Wallet.getAvailableWallets(),
    msg: "",
  });
};

export const disconnectCardanoWallet = (provider, callback) => async (dispatch) => {
  
  if (await Wallet.enable(provider)) {
    sessionStorage.removeItem("wallet");
    dispatch(walletCardanoDisconnected());
    callback({
      success: true,
    });
  }
  else {
    callback({
      success: false,
    });
  }
};

export const connectCardanoWallet = (provider, callback) => async (dispatch) => {

  dispatch(setWalletLoading(WALLET_STATE.CONNECTING));

  let wallet_provider = await window.cardano[provider].enable();

  if (wallet_provider) {
    await lucid_user.selectWallet(wallet_provider)
    
    sessionStorage.setItem("wallet", provider);
    
    const connectedWallet = {
      wallet: provider,
      address: await lucid_user.wallet.address()
    };
    dispatch(walletCardanoConnected(connectedWallet));
    callback({
      success: true,
      data: connectedWallet,
    });
  } else {
    dispatch(setWalletLoading(false));
    callback({
      success: false,
      msg: "Please switch your Wallet's Network.",
    });
  }
};
