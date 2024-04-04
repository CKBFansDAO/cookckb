import React, { useState, useEffect } from 'react';
import { getTransaction } from '../utils/lumos';
import { useTranslation } from 'react-i18next';
import { showError, showSuccessToast } from '../utils/helper';
import { useQuery } from '@tanstack/react-query';

const usePollingTx = ({ hash, stopCallback }) => {
    console.log(hash);
    const [t] = useTranslation();

    const callback = () => {
        if (stopCallback) {
            stopCallback();
        }
    }

    const pollTransaction = async () => {
        try {
            const res = await getTransaction(hash);
            // 检查交易是否已上链
            const isCommitted = res?.txStatus?.status === 'committed';
            if (isCommitted) {
                showSuccessToast(t('common.tx-successful'))
                callback();
            } else if (res?.txStatus?.status === 'rejected') {
                showError(res?.txStatus?.reason);
                callback();
            }
            return res; // 返回查询结果
        } catch (error) {
            showError(error);
            callback();
        }
    };

    const { data, error, isFetching, refetch, status } = useQuery({
        queryKey: ['transaction', hash],
        queryFn: pollTransaction,

        enabled: !!hash, // 只有当hash存在时才启用查询
        refetchInterval: 5000, // 每5秒轮询一次
        refetchOnWindowFocus: false, // 窗口聚焦时不重新轮询
        retry: false, // 查询失败时不重试
    });

    // 根据查询状态设置交易状态和成功状态
    const txStatus = data?.txStatus?.status || 'pending';
    const success = txStatus === 'committed';

    // 如果hash变化，重新开始轮询
    useEffect(() => {
        if (hash) {
            refetch();
        }
    }, [hash, refetch]);

    return { polling: isFetching, success, txStatus };
};

export default usePollingTx;