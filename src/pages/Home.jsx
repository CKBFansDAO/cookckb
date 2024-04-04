import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ReactComponent as HeroImage } from '../assets/images/home-hero.svg';


const Home = () => {

    const [t] = useTranslation()

    return (
        <div class="flex flex-col w-full px-10 gap-10 md:gap-24">
            <div className='flex items-center gap-10 flex-col md:flex-row'>
                <div className="md:w-8/12 flex flex-col gap-10 bg-[url('assets/images/home-slogan-bg.png')] bg-contain bg-center bg-no-repeat">
                    <span class="title font-bold text-center text-[40px] md:text-[50px]">{t('common.slogan')}</span>
                    <p class="text-[20px] md:text-[24px]">{t('common.slogan-desc')}</p>
                    <div class="flex md:mt-10 justify-center gap-5 md:gap-10">
                        <Link class="flex justify-center" to="basic_tutorials/connect_wallets"><div class="flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#733dff] px-3 md:px-10 py-1 text-sm font-semibold  hover:opacity-90 text-[#EEE] md:text-xl">Get Started</div></Link>
                        <a href="https://docs.cookckb.dev" target="_blank" rel="noopener noreferrer" class="flex justify-center"><div class="flex h-10 cursor-pointer items-center justify-center rounded-full border border-[#733dff] px-3 md:px-10 py-1 text-sm font-semibold text-[#733dff]  hover:opacity-90 md:text-xl">Learn More &gt;</div></a>
                    </div>
                </div>
                <div className='grow'>
                    <HeroImage className='w-full place-self-center' />
                </div>
            </div>
            <div className='flex flex-col bg-[#733DFF] bg-opacity-5 -mx-10 p-10 md:py-24 -mb-20 justify-center gap-10'>
                <div className='title font-bold text-center text-[40px] md:text-[50px]'> Popular Recipes
                </div> 
                <span className='title text-center text-gray-700'>{t("common.coming-soon")}...</span>
            </div>
        </div>
    );
}

export default Home;
