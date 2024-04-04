import React, { useContext, useEffect, useState } from 'react';
import { capacityOf } from '../utils/lumos';

export const useCKBBalance = (address, execImmediately = true ) => {
    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (!address || address.length === 0) {
            setBalance(0);
        }
        else {
            if (execImmediately) {
                setIsLoading(true);
                getBalance(address);
            }
        }

        return () => {
        };
    }, [address, execImmediately]);

    const getBalance = async () => {
        if (address) {
            console.log('getting');
            setIsLoading(true);
            let capacity = await capacityOf(address);
            setBalance(parseFloat(capacity));
            setIsLoading(false);

            return capacity;
        }
        
        return 0;
    }

    return { balance, isLoading, getBalance };
}