import * as React from "react";

interface Props {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton: React.ReactNode;
}

const SkeletonComponent: React.FunctionComponent<Props> = (props: Props) => {
  if (props.isLoading) {
    return (<>props.skeleton</>);
  } else {
    return (<>props.children</>);
  }
};


export default SkeletonComponent;
