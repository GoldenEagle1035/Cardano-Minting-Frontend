import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import {
    availableWallets,
    connectCardanoWallet,
    disconnectCardanoWallet,
} from "../../store/wallet/api";

import Wallet from '../../cardano/wallet';

import "./ButtonConnect.css";

const cardanoWallets = {
    ccvault: {
        title: "ccvault.io",
        image: "/images/wallets/ccvault.png",
    },
    gerowallet: {
        title: "GeroWallet",
        image: "/images/wallets/gero.png",
    },
    nami: {
        title: "Nami",
        image: "/images/wallets/nami.svg",
    },
};

const ButtonConnect = ({ }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showCardanoWallets, setShowCardanoWallets] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);

    const state_wallet = useSelector((state) => state.wallet);

    const hideWallets = () => {
        setShowCardanoWallets(false);
    };

    const onclick_connect_wallet = () => {
        console.log("onclick_connect_wallet", state_wallet.connected);
        if (!state_wallet.connected) {
            dispatch(availableWallets((res) => {
                setShowCardanoWallets(res.wallets);
            }));
        }
        else {
            if (state_wallet.connected) {
                dispatch(disconnectCardanoWallet(selectedWallet, (res) => {
                    Wallet.restoreProvider();
                }));
            }
            navigate("/");
        }
    };

    const connect_CardanoWallet = (wallet_name) => {
        console.log("connect_CardanoWallet", wallet_name);
        setShowCardanoWallets(false);
        dispatch(connectCardanoWallet(wallet_name, (res) => {
            if (res.success) {
                setSelectedWallet(wallet_name);
            }
        }));
    };

    const ref = useRef();

    useEffect(() => {
        if(state_wallet.wallet != null)
            connect_CardanoWallet(state_wallet.wallet);
    }, {});

    return (
        <>
            <button
                className="border-radiusborder-white border-2 bg-gradient-to-r from-[#8472bb] to-[#5f3f9f] text-white font-bold py-3 lg:px-10 md:px-5 cursor-pointer disabled:cursor-not-allowed disabled:text-black"
                
                onClick={() => onclick_connect_wallet()}
            >
                {!state_wallet.connected 
                    ? (state_wallet.loading ? "Connecting..." : "Connect Wallet")
                    : state_wallet.address.slice(0, 5) + "..." + 
                    state_wallet.address.slice(state_wallet.address.length - 3)}
            </button>
            {
                showCardanoWallets ? (
                    <div className="fixed backdrop-filter backdrop-blur-sm bg-backdrop flex items-center justify-center overflow-auto z-50 inset-0">
                        <div
                            className="relative bg-white dark:bg-blue-darkest rounded-xl shadow-xl px-16 py-10 max-w-xl w-11/12 md:w-full"
                            ref={ref}
                        >
                            <div className="text-center mb-7">
                                <h1 className="text-blue-dark dark:text-gray-lightest mb-10 font-bold text-3xl">
                                    Select wallet
                                </h1>
                            </div>{" "}
                            <button
                                type="button"
                                onClick={hideWallets}
                                className="absolute text-2xl px-2.5 text-gray-dark top-3 right-3 hover:opacity-100 opacity-70"
                            >
                                <i className="fas fa-times" />
                            </button>{" "}
                            <div className="flex justify-center gap-7">
                                {showCardanoWallets &&
                                    showCardanoWallets.length > 0 &&
                                    showCardanoWallets.map((name) => (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => connect_CardanoWallet(name)}
                                                className="relative w-36 p-3 bg-gray-lightest dark:bg-blue-darker rounded-xl text-blue-dark dark:text-gray-regular bg-opacity-60 border-2 hover:bg-opacity-10 dark:hover:bg-blue-meta dark:hover:bg-opacity-20 hover:bg-blue-light hover:border-blue-light text-lg font-semibold dark:border-blue-darkest"
                                            >
                                                <img
                                                    src={cardanoWallets[name].image}
                                                    alt="eternl wallet"
                                                    className="w-16 h-16 p-2 mx-auto mb-2"
                                                />
                                                {name}
                                                <div className="text-xs font-normal mt-1.5 text-blue-dark dark:text-blue-meta">
                                                    <i className="fas fa-link" />
                                                    enabled
                                                </div>
                                            </button>
                                        </div>
                                    ))}

                            </div>
                        </div>
                    </div>
                ) : null
            }
        </>
    );
};

export default ButtonConnect;
