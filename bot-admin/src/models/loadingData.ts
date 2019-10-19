export interface ILoadingData<T> {
    isFetching: boolean;
    isError: boolean;
    data?: T;
}
