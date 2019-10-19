import { css } from '@emotion/core';
import React from 'react';
import { HashLoader } from 'react-spinners';
// Another way to import. This is recommended to reduce bundle size

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

interface IProps {
    isLoading: true;
}

export default class Spinner extends React.Component<IProps> {
    public render(): JSX.Element {
        return (
            <div className="sweet-loading">
                <HashLoader css={override} sizeUnit={'px'} size={150} color={'#123abc'} loading={this.props.isLoading} />
            </div>
        );
    }
}
