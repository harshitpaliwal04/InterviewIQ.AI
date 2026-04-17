import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({ timeleft, totalTime }) => {
        const percentage = Math.round((timeleft / totalTime) * 100);
        return (
                <div className='w-20 h-20'>
                        <CircularProgressbar
                                value={percentage}
                                // maxValue={totalTime}
                                text={`${timeleft}s`}
                                styles={buildStyles({
                                        textSize: "20px",
                                        pathColor: "#059669",
                                        textColor: "#059669",
                                        trailColor: "#f3f4f6",
                                })}
                        />
                </div>
        )
}

export default Timer