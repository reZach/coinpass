import Header from "./shared/header";
import React from "react";
import updateTime from "../data/lastupdatetime";

function Faq() {

    return (
        <div className="App">
            <Header page={"faq"} />
            <div className="container">
                <div className="row mt-4">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8 col-12">
                        <h1 className="display-1 header">FAQ</h1>
                        <h1 className="display-3 header">I can't see pins on the map</h1>
                        <p>First, choose a coin from the dropdown, then select the "Show" checkbox. You can then navigate by clicking on the buttons or panning the map.</p>

                        <h1 className="display-3 header">Why isn't my action on the map<span style={{ position: "relative", top: "-8px" }}>?</span></h1>
                        <p>Actions are updated on a manual basis in order to keep costs for hosting the website to a minimum. You may need to clear your website  cookies/cache in order to see the updates, I will aim to update the website once a day. You can see when the website data was updated by checking the bottom of this page.</p>

                        <h1 className="display-3 header">Where can I get a coin<span style={{ position: "relative", top: "-8px" }}>?</span></h1>
                        <p>A limited run of coins were minted; there is no way to get a coin unless you receive it from someone else. I've toyed with the idea of minting more coins in the future if the idea gets popular.</p>

                        <h1 className="display-3 header">Why coins and not something else<span style={{ position: "relative", top: "-8px" }}>?</span></h1>
                        <p>I wanted to use something that was tangible and easily tradeable between people.</p>

                        <h1 className="display-3 header">Where does city data come from<span style={{ position: "relative", top: "-8px" }}>?</span></h1>
                        <p>Map data comes from <a href="https://simplemaps.com/data/world-cities">https://simplemaps.com/data/world-cities</a>.</p>

                        <h1 className="display-3 header">My city isn't listed as an option to choose</h1>
                        <p>If your city isn't listed on the <a href="/#action">action page</a>, you can submit your city details on <a href="/#addcity">this page</a> and we will work to get your city added in a few working days.</p>

                        <h1 className="display-3 header">I have a suggestion for the website</h1>
                        <p>
                            Create a Github account and post an issue or discussion [or contribute] here: <a href="https://github.com/reZach/coinpass">https://github.com/reZach/coinpass</a>.
                        </p>
                        <p style={{ marginTop: "80px" }}><em>Data last updated on {new Date(updateTime.time).toLocaleDateString()}</em></p>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
            </div>
        </div>
    );
}

export default Faq;
