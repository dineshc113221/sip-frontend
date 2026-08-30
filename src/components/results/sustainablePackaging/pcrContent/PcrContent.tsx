import React, { useContext } from 'react'
import './pcrContent.scss'
import PcrDonutChart from './PcrDonutChart'
import { Typography } from '@mui/material'
import DetailedTable from "../../commonComponents/DetailedTable";
import { ResultDataContext } from '../../../../contexts/resultData/ResultDataContext';

export const PcrContent: React.FC = () => {
    const { sustainablePackagingData } = useContext(ResultDataContext);
    const dialData = sustainablePackagingData?.pcrContent?.dialData || { baseline: '0', myproduct: '0', per_pcr_diff: '0' };

    return (
        <div className='pcr-main-container'>
            <div className='main_sub_container1'>
                <div>
                    <Typography className='main_sub_container1_typography1'>
                        Has PCR content been incorporated into the packaging?
                    </Typography>
                </div>
            </div>
            <div className='main_sub_container2'>
                <div className='sub_container2_1'>

                    <Typography className='sub_container2_1_typography1'>
                        Kenvue’s Direction
                    </Typography>


                    <Typography className='sub_container2_1_typography2'>
                        PCR-inclusion is a must-do action to deliver Packaging Circularity. Post-consumer recycled content reduces our dependency on new fossil-fuel plastics and has a lower Product Carbon Footprint.
                    </Typography>

                </div>
                <div className='sub_container2_2'>
                    <div>
                        <Typography className='sub_container2_2_typography1'>
                            Proportion of PCR content in Consumer packaging
                        </Typography>
                    </div>
                    <div className='sub_container2_2_donut_chart'>
                        <PcrDonutChart dialsData={dialData} />
                    </div>
                    <div className="donutchart-bottom-section">
                        <div className='donutchart-div1'>
                            <div className='donutchart-div2'>
                                <div className='donutchart-div3'></div>
                                <p className='donutchart-p1'>Baseline</p>
                            </div>
                            <div className='donutchart-div4'>
                                <div className='donutchart-div5'></div>
                                <p className='donutchart-p1' style={{width:'83px'}}>My Product</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bottom-section">
                <Typography className="table-heading">Detailed Results</Typography>
                <DetailedTable currentTab={"PCR_CONTENT"} />
            </div>
        </div>
    )
}