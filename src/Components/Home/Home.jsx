import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Home.css";
import { getAllCollections } from '../../store/collection/api';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import mintitembg from "../../Assets/images/mintitembackground.png";

import LoadingScreen from 'react-loading-screen';

import {
    mintNFT
} from "../../store/wallet/api";

const Home = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const mintingCollections = useSelector((state) => state.collection.minting_collections);
    const mintingState = useSelector((state) => state.collection.minting_state);
    const [mint_count, setMintCount] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");

    const state_wallet = useSelector((state) => state.wallet);

    const [showMintDialog, setShowMintDialog] = useState(false);
    const [selected, setSelected] = useState(0);

    useEffect(() => {

        console.log("useEffect->mintingCollections:", mintingCollections);
    }, [mintingCollections])
    useEffect(() => {
        dispatch(getAllCollections());
        console.log(mintingCollections);
    }, [])

    const onMint = async (num) => {

        if (!mint_count) {
            toast("Please imput mint count!");
            return;
        }
        if (mintingCollections[num].MintedInfo.match(/A/g).length < mint_count || mint_count < 0) {
            toast("Please imput correct mint count!");
            return;
        }
        console.log("onMint--->", num, state_wallet.connected);
        if (!state_wallet.connected) {
            toast("Connect wallet first!");
            return;
        }
        else {
            console.log("before call mintNFT--->", mintingCollections[num]);

            setLoadingText("Minting NFTs...");
            setIsLoading(true);

            dispatch(mintNFT(mintingCollections[num], mint_count, ((res) => {
                if (res.success) {
                    toast("Successfully minted!");
                    setShowMintDialog(false)
                    setMintCount();
                    setLoadingText("");
                    setIsLoading(false);
                    navigate("/");
                }
                else toast(res.error);
            })));

            setLoadingText("");
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="homebackgroundimage">
                <div className="container max-w-7xl mx-auto px-8 md:px-20 pt-20 min-h-screen">
                    <div className="justify-center titletext flex gap-2">
                        <div> Terra </div>
                        <img className="w-[200px] h-[200px]" src="/images/mechlogo1.png" />
                        <div> Mecha </div>
                    </div>
                    {/* <h1 className="mt-20 font-bold text-5xl xl:text-6xl text-white mb-4  ">
                        Mint
                    </h1> */}
                    <div className="container max-w-7xl mx-auto px-8 md:px-20 pt-20 min-h-screen">
                        {mintingCollections.map((item, index) => {
                            return (
                                <div className="py-10">
                                    <div className="mintboxbackgroundimage text-white border-blue-500 border rounded-lg">
                                        <div className="max-w-2xl mx-auto py-3 px-4 md:py-4 sm:px-0 md:max-w-7xl md:px-2 rounded-xl mb-6 md:mb-10">
                                            <div className="md:grid md:grid-cols-2 md:gap-x-6 lg:items-start sm:px-6 justify-between h-[600px]">
                                                <div className=" w-full max-w-2xl mx-auto md:max-w-none grid content-between h-full max-w-[500px]">
                                                    <div>
                                                        <div className="mt-20 rounded-lg overflow-hidden">
                                                            <img src={mintitembg} className="px-2 py-2 w-full border-white border-2 h-[300px] object-center object-contain rounded-lg" />
                                                            {/* <img src={`https://gateway.pinata.cloud/ipfs/${item.RepresentativeIpfs}`} className="px-2 py-2 w-full border-white border-2 h-[300px] object-center object-contain rounded-lg relative" /> */}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="mt-4 mb-1 text-sm font-medium dark:text-white text-left text-blue-500">NFT MINTED</div>
                                                        <div className="mt-2 text-sm font-medium dark:text-white text-right flex justify-left">
                                                            <p>{(item.MintedInfo.match(/B/g) || []).length} / {item.Count}</p>
                                                        </div>
                                                        <div className={`flex gap-4 items-center justify-between flex-wrap rounded-lg bg-purple-2 p-3.5 mt-4 bg-gray-900 ${(item.MintedInfo.match(/B/g) || []).length == item.Count ? "invisible" : "visible"}`}>
                                                            <div className="w-full mx-auto">
                                                                <div className="flex gap-4">

                                                                    <div className="w-full font-semibold bg-gray-700 p-4 rounded-lg text-center justify-right"
                                                                        onClick={() => { setSelected(index); setShowMintDialog(true); }}>Mint</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 py-1 text-left md:order-first grid content-between h-full">
                                                    <div>
                                                        <h1 className="py-10 text-4xl md:text-6xl font-semibold tracking-tight">{item.Name}</h1>
                                                        <div>
                                                            <div className="text-sm text-gray-300 p-1.5 m-1 rounded-md border border-gray-900 inline-flex my-4">
                                                                TOTAL ITEMS COUNT:
                                                                <p className="ml-1.5 text-white font-bold text-md">{item.Count}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-lg text-gray-400 mb-4">{item.Description}</p>
                                                    </div>
                                                    <div className="text-gray-300">

                                                        <div className=" max-w-xs rounded-lg border px-3 py-2 flex flex-col mt-4 mb-1 border-blue-500 bg-gradient-to-r hover:from-blue-500 hover:to-blue-400">
                                                            <div className="flex justify-between items-center pb-2">
                                                                <div>
                                                                    <div className="flex items-center">
                                                                        <div className="bg-gray-900 rounded-full py-0.5 px-2 text-white-1 text-sm h-fit-content"> Public Mint</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-row gap-2 text-pink-hot text-sm tracking-wide font-medium text-center uppercase items-center">{(item.MintedInfo.match(/B/g) || []).length == item.Count ? "completed" : "in progress"}</div>
                                                            </div>
                                                            <div className="flex gap-1.5 text-white-1 tracking-wide text-sm">
                                                                <span>
                                                                    <b>{item.Price}(₳)</b>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>
                {
                    showMintDialog ? (
                        <div className="fixed backdrop-filter backdrop-blur-sm bg-backdrop flex items-center justify-center overflow-auto z-50 inset-0">

                            <div
                                className="relative mintboxbackgroundimage border-blue-500 border rounded-xl shadow-xl py-10 max-w-xl w-11/12 md:w-full"
                                style={{ height: "400px" }}
                            >

                                {mintingState != "" ?
                                    <div>
                                        <LoadingScreen
                                            loading={mintingState == "" ? false : true}
                                            bgColor='none'
                                            spinnerColor='#0099f8'
                                            textColor='white'
                                            text={mintingState}
                                        />
                                    </div>
                                    :
                                    <div>
                                        <div className="text-center mb-7">
                                            <h1 className="text-white mb-10 font-bold text-4xl">
                                                Mint
                                            </h1>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => { setShowMintDialog(false) }}
                                            className="absolute text-2xl px-2.5 text-white top-3 right-3 hover:opacity-100 opacity-70"
                                        >
                                            <i className="fas fa-times" />
                                        </button>
                                        <div className="md:grid md:grid-cols-2 md:gap-x-6 lg:items-start sm:px-6 justify-between">
                                            <div>
                                                <div className="rounded-lg overflow-hidden">
                                                    <img src={mintitembg} className="px-2 py-2 w-full border-white border-2 h-[200px] object-center object-contain rounded-lg" />
                                                    {/* <img src={`https://gateway.pinata.cloud/ipfs/${mintingCollections[selected].RepresentativeIpfs}`} className="px-2 py-2 w-full border-white border-2 h-[200px] object-center object-contain rounded-lg relative" /> */}
                                                </div>
                                            </div>
                                            <div className="text-gray-300 overflow-hidden">
                                                <div className="text-white text-2xl">{mintingCollections[selected].Name}</div>

                                                <div className="mt-5 justify-between flex">
                                                    <div className="flex gap-1.5 text-white-1 tracking-wide text-sm">
                                                        NFT Price:
                                                        <div className="text-gray-400 text">
                                                            <p>{mintingCollections[selected].Price} ₳</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={"flex gap-4 items-center justify-between flex-wrap rounded-lg bg-purple-2 p-3.5 mt-20 bg-gray-900"}>
                                                    <div className="w-full mx-auto">
                                                        <div className="flex gap-4">
                                                            <input
                                                                type="text"
                                                                placeholder="Mint Count"
                                                                className="placeholder:text-[#333333] text-white w-1/2 font-semibold bg-gray-500 p-1 rounded-lg text-center"
                                                                value={mint_count}
                                                                onChange={(event) => setMintCount(event.target.value.toString())}
                                                            />
                                                            <div className="w-1/2 font-semibold bg-gray-700 p-4 rounded-lg text-center"
                                                                onClick={() => { onMint(selected) }}>Mint Now</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    ) : null
                }
            </div>
        </>
    );
};

export default Home;
