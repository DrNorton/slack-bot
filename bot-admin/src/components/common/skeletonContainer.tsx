import * as React from 'react';

interface IProps {
    isLoading: boolean;
    children: React.ReactNode;
    skeleton: React.ReactNode;
}

const SkeletonComponent: React.FunctionComponent<IProps> = (props: IProps) => {
    if (props.isLoading) {
        return <>props.skeleton</>;
    } else {
        return <>props.children</>;
    }
};

export default SkeletonComponent;
