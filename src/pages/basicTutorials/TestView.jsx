import React from 'react';

const TestView = () => {

    async function getTronWeb() {
        let tronWeb;
        // 确保 tronLink 存在于 window 对象中
        const tronLink = window.tronLink;

        if (tronLink && tronLink.ready) {
            tronWeb = tronLink.tronWeb;
        } else {
            // 在调用 tronLink 的方法之前，确保 tronLink 存在
            const res = await tronLink?.request({ method: 'tron_requestAccounts' });
            if (res && res.code === 200) {
                tronWeb = tronLink.tronWeb;
            }
        }

        console.log(tronWeb);
        return tronWeb;
    }


    return (
        <div className='px-2 py-1 bg-slate-300 rounded' onClick={getTronWeb}>
            Connect TronLink
        </div>
    );
}

export default TestView;
