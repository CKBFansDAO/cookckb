import React, { useEffect, useState } from 'react';
import sidebarItems from './SideBarConfig.json'
import { useTranslation } from 'react-i18next';
import { useNavigate, BrowserRouter, useLocation } from 'react-router-dom';

// SideBar项组件
const SidebarItem = ({ item, isSubItem, active }) => {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(true);

    const location = useLocation()

    const isActiveItem = (item) => {
        let find = item.route === location.pathname;
        if (!find) {
            if (location.pathname === "/") {
                let reRoute = '/home';
                find = item.route == reRoute;
            }
        }

        return find;
    }

    useEffect(() => {

    }, [location]);

    const handleItemClick = () => {
        if (item.items) {
            setExpanded(!expanded);
        } else {
            // 处理路由跳转逻辑
            navigate(item.route);
        }
    };

    return (
        <div className="flex flex-col gap-2 cursor-pointer">
            <div onClick={handleItemClick} className={`listitem px-2 py-1.5 rounded flex w-full items-center ${active ? 'bg-color-main font-bold' : ''}`}>
                <span className={`${isSubItem ? 'ml-4' : ''} text-[20px]`}>{t(item.icon)}</span>
                <span className='ml-2 grow'>{t(item.display_name)}</span>
                {item.items && (expanded ? <i className="fa-solid fa-angle-right place-self-center rotate-90"></i> : <i className="fa-solid fa-angle-right place-self-center"></i>)}
            </div>
            {expanded && item.items && (
                <div className='flex flex-col gap-1'>
                    {item.items.map((subItem, index) => (
                        <SidebarItem key={subItem.route} item={subItem} isSubItem={true} active={isActiveItem(subItem)}/>
                    ))}
                </div>
            )}
        </div>
    );
};

const SideBar = () => {
    const location = useLocation()

    const isActiveItem = (item) => {
        let find = item.route === location.pathname;
        if (!find) {
            if (location.pathname === "/") {
                let reRoute = '/home';
                find = item.route == reRoute;
            }
        }

        return find;
    }

    useEffect(() => {

    }, [location]);

    return (
        <div className="flex flex-col h-full bg-[#303846] p-2 text-white">
            <div className='flex items-center h-48 py-12 w-full'>
                <div className="bg-[url('./assets/images/logo-cookckb-white.svg')] bg-contain bg-center bg-no-repeat w-full h-full"></div>
            </div>
            <div className='flex flex-col grow gap-3'>
                {sidebarItems.map((item, index) => (
                    <SidebarItem key={index} item={item} active={isActiveItem(item)}/>
                ))}
            </div>
        </div>
    );
}
//<BrowserRouter>
export default SideBar;
