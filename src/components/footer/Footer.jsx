import React from 'react';
import { ReactComponent as AppLogo } from '../../assets/images/logo-cookckb-white.svg';


const Footer = () => {
    return (
        <div className='flex flex-col justify-center w-full px-5 bg-[#733DFF] text-white'>

            <div className='flex w-full flex-col md:flex-row gap-10 py-10 md:py-20 justify-between md:px-10'>
                <div className='flex items-center'>
                    <AppLogo className='h-24'></AppLogo>
                </div>

                <div className='flex flex-col gap-3'>
                    <span className='title text-lg mb-3'>Community</span>
                    <a className={`flex items-center gap-2 hover:text-[#ddd]`} href={'https://x.com/NervosNetwork'} rel="noopener noreferrer" target="_blank">
                        <i className="text-white fa-brands fa-xl fa-x-twitter"></i> Nervos
                    </a>
                    <a className={`flex items-center gap-2 hover:text-[#ddd]`} href={'https://talk.nervos.org'} rel="noopener noreferrer" target="_blank">
                        <i className="text-white fa-solid fa-comment-dots fa-xl"></i> Talk
                    </a>
                    <a className={`flex items-center gap-2 hover:text-[#ddd]` } href={'https://discord.com/invite/vtzdRB3uh6'} rel="noopener noreferrer" target="_blank">
                        <i className="text-white fa-brands fa-discord fa-lg"></i> Dev Discord
                    </a>

                </div>
                <div className='flex flex-col gap-3'>
                    <span className='title text-lg mb-3'>Resource</span>
                    <a className={`flex items-center gap-2 hover:text-[#ddd]`} href={'https://github.com/CKBFansDAO/cookckb'} rel="noopener noreferrer" target="_blank">
                        <i className="text-white fa-brands fa-xl fa-github "></i> Github
                    </a>
                    <a className='text-white hover:text-[#ddd]' href="https://docs.cookckb.dev" rel="noopener noreferrer" target="_blank">
                    <i className="text-white fa-book fa-solid fa-xl"></i> Documents
                    </a>

                </div>
            </div>

           
            <div className='flex flex-col items-center justify-center -mt-5 pb-5'>
                <span>Copyright © 2024, CookCKB.dev. All rights reserved.</span>
                <span>❤️‍🔥 Built by CKBFans community with ❤️‍🔥</span>
            </div>
        </div>
    );
}

export default Footer;
