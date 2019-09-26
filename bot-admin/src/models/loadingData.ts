export interface LoadingData<T> {
    isFetching: boolean;
    isError:boolean;
    data?: T;
}
