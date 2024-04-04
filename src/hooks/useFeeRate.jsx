import { useEffect, useState } from "react";
import { rpc } from "../utils/lumos";
import { BI } from "@ckb-lumos/bi";
import { LOW_FEE_RATE, MAX_FEE_RATE } from "../constants/Const";

export function useFeeRate(execImmediately = true) {
    const [feeRate, setFeeRate] = useState({
        low: LOW_FEE_RATE,
        median: LOW_FEE_RATE * 2,
        high: LOW_FEE_RATE * 3,
    });

    useEffect(() => {
        let interval = null;

        const getFeeRate = async () => {
            try {
                const { mean, median } = await rpc.getFeeRateStatistics();
                if (mean && median) {
                    setFeeRate({
                        low: LOW_FEE_RATE,
                        median: BI.from(median).toString(),
                        high: Math.min(MAX_FEE_RATE, BI.from(mean).mul(BI.from(2)).toString()),
                    });
                } else {
                    setFeeRate({
                        low:  LOW_FEE_RATE,
                        medium: LOW_FEE_RATE * 2,
                        fast: LOW_FEE_RATE * 3
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (execImmediately) {
            interval = setInterval(getFeeRate, 10 * 1000);
            getFeeRate();
        }

        return () => {
            clearInterval(interval);
        }
    }, [execImmediately]);

    return { feeRate };
}
