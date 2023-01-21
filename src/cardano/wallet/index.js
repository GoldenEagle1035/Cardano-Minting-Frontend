import { C as LCore } from 'lucid-cardano';

const originProvider = window.cardano;

class Wallet {

  async enable(name) {
    if (name === "ccvault") {
      const instance = await window.cardano?.ccvault?.enable();
      if (instance) {
        window.cardano = instance;
        return true;
      }
    } else if (name === "gerowallet") {
      const instance = await window.cardano?.gerowallet?.enable();
      if (instance) {
        window.cardano = instance;
        return true;
      }
    } else if (name === "nami") {
      const instance = await window.cardano?.nami?.enable();
      if (instance) {
        window.cardano = instance;
        return true;
      }
    } else if (name === false) {
      const isEnabled = await window.cardano?.enable();
      if (isEnabled) {
        window.cardano = window.cardano;
        return true;
      }
    }
    return false;
  }

  restoreProvider () {
    console.log(window.cardano);
    window.cardano = originProvider;
    console.log(window.cardano);
  }

  async getAvailableWallets() {
    
    let availableWallets = [];

    if (window.cardano === undefined) {
      return availableWallets;
    }

    if (window.cardano.ccvault) {
      availableWallets.push("ccvault");
    }

    if (window.cardano.gerowallet) {
      availableWallets.push("gerowallet");
    }

    if (window.cardano.nami.enable) {
      availableWallets.push("nami");
    }
    console.log("availableWallets", availableWallets);
    return availableWallets;
  }

  async getBalance() {
    return await window.cardano.getBalance();
  }

  async getAddress() {
    return await window.cardano.getAddress();
  }

  async getCollateral() {
    return await window.cardano.experimental.getCollateral();
  }

  async getNetworkId() {
    return await window.cardano.getNetworkId();
  }

  async getUsedAddresses() {
    return await window.cardano.getUsedAddresses();
  }

  async getChangeAddress() {
    return await window.cardano.getChangeAddress();
  }

  async getUtxos() {
    return await window.cardano.getUtxos();
  }

  async signTx(tx, partialSign = true) {
    return await window.cardano.signTx(tx, partialSign);
  }

  async submitTx(tx) {
    return await window.cardano.submitTx(tx);
  }
}

export default new Wallet();
