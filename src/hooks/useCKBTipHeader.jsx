import { useEffect, useState } from "react";
import { BI } from "@ckb-lumos/bi";
import { rpc } from "../utils/lumos";
import { useQuery } from "@tanstack/react-query";


const useCKBTipHeader = () => {

    const parseEpoch = (epoch) => {
        const epochBI = BI.from(epoch);
        return {
            length: epochBI.shr(40).and(0xffff).toNumber(),
            index: epochBI.shr(24).and(0xffff).toNumber(),
            number: epochBI.and(0xffffff).toNumber(),
        };
    }

    const { data: result, isLoading, refetch, isError } = useQuery({
        queryKey: ["ckbTipHeader"],
        queryFn: async () => {
            //const tipHeader = await getTipHeader();
            const tipHeader = await rpc.getTipHeader();

            const curEpoch = parseEpoch(tipHeader.epoch);

            const latestBlock = BI.from(tipHeader.number).toNumber();

            return {
                epoch: curEpoch,
                latestBlock
            }
        },
        staleTime: 60 * 1000, // 1 minute
        refetchInterval: 60 * 1000, // 1 minute
    });

    return { data: result, isLoading, refetch, isError };

}

export default useCKBTipHeader;
