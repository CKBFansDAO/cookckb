import './App.css';
import appConfig from './appConfig';
import { useTranslation } from 'react-i18next';

function App() {
    const [t] = useTranslation()
    return (
        <div class="flex w-full justify-center py-10">
            <div class="flex flex-col place-items-center">

                <span class="title font-bold text-[40px] md:text-[100px]">{t('common.slogan')}</span>
                <p class="text-center text-[20px] md:text-[30px] md:w-1/2">{t('common.slogan-desc')}</p>
                <div class="mt-20 flex flex-col gap-14 md:flex-row">
                    <a class="flex justify-center" href="#"><div class="flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#733dff] px-10 py-1 text-base font-semibold  hover:opacity-90 text-[#EEE] md:text-xl">Get Started</div></a>
                    <a href="https://docs.cookckb.dev" target="_blank" rel="noopener noreferrer" class="flex justify-center"><div class="flex h-10 cursor-pointer items-center justify-center rounded-full border border-[#733dff] px-10 py-1 text-base font-semibold text-[#733dff]  hover:opacity-90 md:text-xl">Learn More &gt;</div></a>
                </div>
            </div>
        </div>
    );
}

export default App;
