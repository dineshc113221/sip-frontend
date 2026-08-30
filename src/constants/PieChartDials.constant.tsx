import React from "react";

export const ProductEnvironmentalFootprint_series0 = [
    {
        dialsIndicator: "Very poor",
        rangeIndicator: 10,
        colors: "#FF6B6B",
        actaulRangeIndicator: "% > +20%",
    },
    {
        dialsIndicator: "Poor",
        rangeIndicator: 10,
        colors: "#FFB000",
        actaulRangeIndicator: "+10 < % ≤ +20",
    },
    {
        dialsIndicator: "No Improvement",
        rangeIndicator: 5,
        colors: "#d0d0d0",
        actaulRangeIndicator: "\n -10 ≤ % ≤ +10",
    },
    {
        dialsIndicator: "Good",
        rangeIndicator: 10,
        colors: "#BCD530",
        actaulRangeIndicator: "-10 > %  ≥ -20",
    },
    {
        dialsIndicator: "Excellent",
        rangeIndicator: 10,
        colors: "#00B097",
        actaulRangeIndicator: "% < -20",
    },
];

export const CarbonFootprint_series0 = [
    {
        dialsIndicator: "Very poor",
        rangeIndicator: 10,
        colors: "#FF6B6B",
        actaulRangeIndicator: "% > +20%",
    },
    {
        dialsIndicator: "Poor",
        rangeIndicator: 10,
        colors: "#FFB000",
        actaulRangeIndicator: "+10 < % ≤ +20",
    },
    {
        dialsIndicator: "No Improvement",
        rangeIndicator: 5,
        colors: "#d0d0d0",
        actaulRangeIndicator: "\n -10 ≤ % ≤ +10",
    },
    {
        dialsIndicator: "Good",
        rangeIndicator: 10,
        colors: "#BCD530",
        actaulRangeIndicator: "-10 > %  ≥ -20",
    },
    {
        dialsIndicator: "Excellent",
        rangeIndicator: 10,
        colors: "#00B097",
        actaulRangeIndicator: "% < -20",
    },
];

export const GreenChemistry_series0 = [
    {
        dialsIndicator: "Very poor",
        rangeIndicator: 10,
        colors: "#FF6B6B",
        actaulRangeIndicator: "Points < -10",
    },
    {
        dialsIndicator: "Poor",
        rangeIndicator: 10,
        colors: "#FFB000",
        actaulRangeIndicator: "-10 ≤ Points ≤ -5",
    },
    {
        dialsIndicator: "No Improvement",
        rangeIndicator: 5,
        colors: "#d0d0d0",
        actaulRangeIndicator: "\n -5 < Points ≤ +5",
    },
    {
        dialsIndicator: "Good",
        rangeIndicator: 10,
        colors: "#BCD530",
        actaulRangeIndicator: "+5 < Points ≤ +10",
    },
    {
        dialsIndicator: "Excellent",
        rangeIndicator: 10,
        colors: "#00B097",
        actaulRangeIndicator: "Points > +10",
    },
];

export const SustainablePackaging_series0 = [
    {
        dialsIndicator: "Very poor",
        rangeIndicator: 10,
        colors: "#FF6B6B",
        actaulRangeIndicator: "Points < -20",
    },
    {
        dialsIndicator: "Poor",
        rangeIndicator: 10,
        colors: "#FFB000",
        actaulRangeIndicator: "-20 ≤ Points ≤ 0",
    },
    {
        dialsIndicator: "No Improvement",
        rangeIndicator: 5,
        colors: "#d0d0d0",
        actaulRangeIndicator: "\n 0 < Points ≤ +10",
    },
    {
        dialsIndicator: "Good",
        rangeIndicator: 10,
        colors: "#BCD530",
        actaulRangeIndicator: "+10 < Points ≤ +20",
    },
    {
        dialsIndicator: "Excellent",
        rangeIndicator: 10,
        colors: "#00B097",
        actaulRangeIndicator: "Points > +20",
    },
];

export const SustainablePackaging_series1 = [
    {
        dialsIndicator: "Excellent",
        rangeIndicator: 100,
        colors_series1: "#b9bab7",
        actaulRangeIndicator: "% < -20",
    },
    {
        dialsIndicator: "Good",
        rangeIndicator: 100,
        colors_series1: "#dbdbdb",
        actaulRangeIndicator: "-10 > %  ≥ -20",
    },
];

export const ProductEnvironmentalFootprintFlipcardDescription: React.FC = () => {
    return (
        <div className='flipcard_description'>
            <div className='flip-card-label1'><span style={{fontFamily: "kenvue-sans"}}>Product Environmental Footprint</span></div>
            <div className='flip-card-label2'>
                The Product Environmental Footprint score uses Life Cycle Assessment (LCA) to measure a product's environmental impact. This dial compares the new product's footprint to the baseline. A negative percentage shows progress in reducing the footprint.
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_Excellent"></span>&nbsp;Excellent</div>
                <div className='flip-card-label3_div2'>% &lt; -20</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_good"></span>&nbsp;Good</div>
                <div className='flip-card-label3_div2'>-20 ≤ %  &lt; -10</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_no_improvement"></span>&nbsp;No Improvement</div>
                <div className='flip-card-label3_div2'>-10 ≤ % ≤ +10</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_poor"></span>&nbsp;Poor</div>
                <div className='flip-card-label3_div2'>+10 &lt; % ≤ +20</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_very_poor"></span>&nbsp;Very Poor</div>
                <div className='flip-card-label3_div2'>% &gt; +20%</div>
            </div>
            <br />
        </div>
    )
};

export const CarbonFootprintFlipcardDescription: React.FC = () => {
    return (
        <div className='flipcard_description'>
            <div className='flip-card-label1'><span style={{ fontFamily: "kenvue-sans" }}>Product Carbon Footprint</span></div>
            <div className='flip-card-label2'>
                A product's Product Carbon Footprint measures the total greenhouse gas emissions, especially CO2, across its life cycle, quantifying its impact on climate change. This dial compares the new product’s Product Carbon Footprint to the baseline. A negative percentage indicates progress in reducing the footprint.
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_Excellent"></span>&nbsp;Excellent</div>
                <div className='flip-card-label3_div2'>% &lt; -20</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_good"></span>&nbsp;Good</div>
                <div className='flip-card-label3_div2'>-20 ≤ %  &lt; -10</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_no_improvement"></span>&nbsp;No Improvement</div>
                <div className='flip-card-label3_div2'>-10 ≤ % ≤ +10</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_poor"></span>&nbsp;Poor</div>
                <div className='flip-card-label3_div2'>+10 &lt; % ≤ +20</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_very_poor"></span>&nbsp;Very Poor</div>
                <div className='flip-card-label3_div2'>% &gt; +20</div>
            </div>
            <br />
        </div>
    );
}


export const GreenChemistryFlipcardDescription: React.FC = () => {
    return (
        <div className='flipcard_description'>
            <div className='flip-card-label1'><span style={{ fontFamily: "kenvue-sans" }}>Green Chemistry</span></div>
            <div className='flip-card-label2'>
                The Green Chemistry score promotes formulations that minimize harmful substances for health and the environment. It consists of 3 pillars: GAIA score, Watch List score, and Renewable Origin index. Scores range from 0 to 100, with 100 being the best. A positive number indicates progress.
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_Excellent"></span>&nbsp;Excellent</div>
                <div className='flip-card-label3_div2'>Points &gt; +10</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_good"></span>&nbsp;Good</div>
                <div className='flip-card-label3_div2'>+5 &lt; Points ≤ +10 </div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_no_improvement"></span>&nbsp;No Improvement</div>
                <div className='flip-card-label3_div2'>-5 &lt; Points ≤ +5</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_poor"></span>&nbsp;Poor</div>
                <div className='flip-card-label3_div2'>-10 ≤ Points ≤ -5</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_very_poor"></span>&nbsp;Very Poor</div>
                <div className='flip-card-label3_div2'>Points &lt; -10</div>
            </div>
            <br />
        </div>
    );
}


export const SustainablePackagingFlipcardDescription: React.FC = () => {
    return (
        <div className='flipcard_description'>
            <div className='flip-card-label1'><span style={{ fontFamily: "kenvue-sans" }}>Packaging Circularity</span></div>
            <div className='flip-card-label2'>
                The Packaging Circularity score promotes the design of Packaging Circularity experiences that delight consumers everyday. It includes four pillars: PCR content, recyclability, material efficiency, and materials to avoid.<br />
                Our goal is to increase the Packaging Circularity score - a positive number indicates progress.
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_Excellent"></span>&nbsp;Excellent</div>
                <div className='flip-card-label3_div2'>Points &gt; +20</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_good"></span>&nbsp;Good</div>
                <div className='flip-card-label3_div2'>+10 &lt; Points ≤ +20</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_no_improvement"></span>&nbsp;No Improvement</div>
                <div className='flip-card-label3_div2'>0 &lt; Points ≤ +10</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_poor"></span>&nbsp;Poor</div>
                <div className='flip-card-label3_div2'>-20 ≤ Points ≤ 0</div>
            </div>
            <div className='flip-card-label3'>
                <div className='flip-card-label3_div1'><span className="dot_very_poor"></span>&nbsp;Very Poor</div>
                <div className='flip-card-label3_div2'>Points &lt; -20</div>
            </div>
            <br />
        </div>
    );
}