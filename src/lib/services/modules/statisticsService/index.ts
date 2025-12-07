import { apiSlice } from "../../api";
import type {
    GeneralStatisticsResponse,
    StatisticsFilterRequest,
} from "./type";

export const statisticsApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({

        getGeneralStatistics: build.query<GeneralStatisticsResponse, StatisticsFilterRequest | void>({
            query: (params) => ({
                url: "/statistics/general",
                params: params ? params : undefined,
            }),
        }),

    }),
})

export const {
    useGetGeneralStatisticsQuery,
} = statisticsApi

export type {
    CustomerStatisticsResponse,
    GeneralStatisticsResponse,
    OrderStatisticsResponse,
    ProductStatisticsResponse,
    RevenueStatisticsResponse,
    SalesChannelStatisticsResponse,
    StatisticsFilterRequest,
    VoucherStatisticsResponse
} from "./type";

