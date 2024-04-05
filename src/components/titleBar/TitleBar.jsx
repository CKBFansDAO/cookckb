import React from 'react';
import { useNavigate } from 'react-router-dom';


const TitleBar = ({ title, onBack, topRight }) => {


    const navigate = useNavigate();

    const handleGoBack = () => {
        if (onBack) {
            onBack()
        } else {
            if (window.history.length > 1) {
                navigate(-1);
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className='flex h-9 w-full'>
            <div className='w-6 flex items-center'>
                <i className="fa-solid fa-angle-left fa-xl hover:text-color-main cursor-pointer" onClick={handleGoBack}></i>
            </div>
            <h1 className='text-xl font-bold w-full grow text-center py-1'>{title}</h1>
            <div className='w-6 flex items-center'>
                {topRight}
            </div>
        </div>
    );
};


export default TitleBar;

