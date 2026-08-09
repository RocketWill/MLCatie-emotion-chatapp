import React from "react";
import {Progress} from "semantic-ui-react"


class ProgressBar extends React.Component {
    render(){
        const {percentUploaded} = this.props;
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
