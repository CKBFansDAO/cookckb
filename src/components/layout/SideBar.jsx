import React, { useEffect, useState } from 'react';
import sidebarItems from './SideBarConfig.json'
import { useTranslation } from 'react-i18next';
import { useNavigate, BrowserRouter, useLocation } from 'react-router-dom';

// SideBar项组件
const SidebarItem = ({ item, isSubItem, active }) => {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

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
            <div onClick={handleItemClick} className={`hover:bg-slate-200 p-2 rounded flex w-full items-center ${active ? 'bg-slate-100' : ''}`}>
                <span className={`${isSubItem ? 'ml-4' : ''} text-[20px]`}>{t(item.icon)}</span>
                <span className='ml-2 grow'>{t(item.display_name)}</span>
                {item.items && (expanded ? <i className="fa-solid fa-angle-right place-self-center rotate-90"></i> : <i className="fa-solid fa-angle-right place-self-center"></i>)}
            </div>
            {expanded && item.items && (
                <div>
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
        <div className="flex flex-col h-full bg-slate-400 p-2">
            <div className='p-10 h-20'>

            </div>
            <div className='flex flex-col grow gap-5'>
                {sidebarItems.map((item, index) => (
                    <SidebarItem key={index} item={item} active={isActiveItem(item)}/>
                ))}
            </div>
        </div>
    );
}
//<BrowserRouter>
export default SideBar;
