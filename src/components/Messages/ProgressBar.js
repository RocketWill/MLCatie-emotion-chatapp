import React from "react";
import {Progress} from "semantic-ui-react"

// const ProgressBar = ({uploadfState, percentUploaded}) => (
//     uploadfState && (
//         <Progress
//                 className="progress__bar"
//                 percent={percentUploaded}
//                 progress
//                 indicating
//                 size="medium"
//                 inverted
//         />
//     )
// );


class ProgressBar extends React.Component {
    render(){
        const {uploadfState, percentUploaded} = this.props;
        return(
            <Progress
                        className="progress__bar"
                        percent={percentUploaded}
                        progress
                        indicating
                        size="medium"
                        inverted
            />
        )
    }
}

export default ProgressBar;