import React, {use} from 'react';
import AppLogo from "@/components/AppLogo";
import NotificationDropdown from "@/layouts/components/topbar/components/NotificationDropdown";
import ProfileDropdown from "@/layouts/components/topbar/components/ProfileDropdown";
import VirtualAssistant from "@/layouts/components/topbar/components/VirtualAssistant";
const MaximizeScreen = dynamic(()=>import("@/layouts/components/topbar/components/MaximizeScreen"), {ssr: false})
const ThemeToggler = dynamic(()=>import("@/layouts/components/topbar/components/ThemeToggler"), {ssr: false})
import {useLayoutContext} from "@/context/useLayoutContext";
import ToggleMobileMenu from "@/layouts/components/topbar/components/ToggleMobileMenu";
import ToggleSidenav from "@/layouts/components/topbar/components/ToggleSidenav";
import dynamic from "next/dynamic";
import {basePath} from "@/helpers";


const Topbar = () => {
    const {customizer} = useLayoutContext()
    return (
        <header className="app-header">
            <div className="d-flex flex-grow-1 w-100 me-auto align-items-center">
                <AppLogo/>

                <ToggleMobileMenu/>

                <ToggleSidenav/>

                <form className="app-search" role="search" action="search.html" autoComplete="off">
                    <input type="text" className="form-control" placeholder="Search for anything"/>
                </form>
            </div>

            <button
                type="button"
                className="btn btn-system hidden-mobile"
                onClick={customizer.toggle}
                aria-label="Open Settings"
            >
                <svg className="sa-icon sa-icon-2x">
                    <use href={`${basePath}/icons/sprite.svg#settings`}></use>
                </svg>
            </button>

            <ThemeToggler/>

            <VirtualAssistant/>

            <MaximizeScreen/>

            <NotificationDropdown/>

            <ProfileDropdown/>
        </header>
    );
};

export default Topbar;