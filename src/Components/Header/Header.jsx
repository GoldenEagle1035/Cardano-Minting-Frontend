// eslint-disable-next-line
import React, { useState } from "react";
import { useEffect } from "react";
import ButtonConnect from "../ButtonConnect/ButtonConnect";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import "./Header.css";

const Header = ({ }) => {

    const state_wallet = useSelector((state) => state.wallet);

    useEffect(() => {

    }, {})
    return (
        <>
            {/* Header */}
            <nav
                className="bg-black  text-white py-3 border-b-2 border-white"
            >
                <div className="container mx-auto flex justify-between items-center  md:gap-2 lg:gap-10 lg:p-0 px-5">
                    <div className="flex justify-between items-center cursor-pointer ">
                        <Link to="/">
                            <div className="flex items-center gap-4 zoom-in text-[white]">
                                <img src="" alt="" />
                                <h2 className="font-bold text-2xl ">Cardano Minting</h2>
                            </div>
                        </Link>
                    </div>
                    
                    <div className=" items-center lg:flex hidden gap-8 cursor-pointer font-apply justify-end">
                        <ButtonConnect />
                    </div>
                </div>
            </nav>

        </>
    );
};

export default Header;