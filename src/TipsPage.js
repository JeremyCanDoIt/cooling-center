import React from 'react';
import './Tips.css';

function TipsPage() {
    return (
        <div className="Tips">
            <div className="header">
                <h1>Cooling Down</h1>
            </div>
            <div className="image1">
                <img src="heatStroke.png" alt="Prevent Heat Stroke" />
                <p className="image-text">St. Mary's Health Care System</p>
            </div>
            <div className="image2">
                <img src="firstaid.png" alt="First Aid for Heat Illness" style={{ width: '100vh', height: 'auto' }}/>
                <p className="image-text">Occupational Safety and Health Administration</p>
            </div>
            <div className="div1">
                <p>
                    Resources/External Links to Cooling Down
                </p>
            </div>
            <div className="urls">
                <a href="https://urldefense.com/v3/__https://www.redcross.org/content/dam/redcross/get-help/pdfs/heat/EN_Extreme-Heat-Safety-Checklist.pdf__;!!CzAuKJ42GuquVTTmVmPViYEvSg!IuIzkiUmQTIZTLYZrtKpugVc2YAFW7o_TZtxo1MJ3nnpp1iIjN6OF7ILsWqEMAwoR5ZmzVpySKuLO1Bu40s$" target="_blank" rel="noopener noreferrer">
                    Red Cross: Extreme Heat Safety Checklist
                    <br />
                </a>
                <a href="https://urldefense.com/v3/__https://www.weather.gov/media/owlie/HeatSafety-OnePager-11-29-2018.pdf__;!!CzAuKJ42GuquVTTmVmPViYEvSg!IuIzkiUmQTIZTLYZrtKpugVc2YAFW7o_TZtxo1MJ3nnpp1iIjN6OF7ILsWqEMAwoR5ZmzVpySKuL22vqgcQ$" target="_blank" rel="noopener noreferrer">
                    National Weather Service: Heat Safety Tips
                    <br />
                </a>
                <a href="https://urldefense.com/v3/__https://www.cdc.gov/disasters/extremeheat/pdf/Heat_Related_Illness.pdf__;!!CzAuKJ42GuquVTTmVmPViYEvSg!IuIzkiUmQTIZTLYZrtKpugVc2YAFW7o_TZtxo1MJ3nnpp1iIjN6OF7ILsWqEMAwoR5ZmzVpySKuLbtdRPS4$" target="_blank" rel="noopener noreferrer">
                    CDC: Identifying Heat Related Illness
                    <br />
                </a>
            </div>
        </div>
    );
}

export default TipsPage;