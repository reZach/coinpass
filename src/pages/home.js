import "./home.css";
import Header from "./shared/header";
import React from "react";
import coin from "../images/coin.jpg";

function Home() {

    const navigate = function (url) {
        window.location.href = url;
    }

    return (
        <div className="App">
            <Header page={"start"} />
            <div className="container">
                <div className="row">
                    <div className="row mb-4">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-8 col-12">
                            <h1 className="display-1 header">Good Samaritan Movement</h1>
                            <h4 style={{ marginBottom: "60px" }}>A project meant to inspire you by showing that even one small act of love can have a rippling effect across the world.</h4>
                            <img src={coin} className="mb-4" />
                            <h1 className="display-3 header">How does it work<span style={{ position: "relative", top: "-8px" }}>?</span></h1>
                            <p>If you are visiting this page and have been given a coin, please follow the steps below.</p>
                            <ol style={{ listStyleType: "decimal" }}>
                                <li style={{ textAlign: "left" }}>Write down the code (which begins with two letters) on your coin on a piece of spare paper.</li>
                                <li style={{ textAlign: "left" }}>Do something you would not normally do; to love or care for another person. If you need ideas of what you can do, check out some examples on our <a href="/#faq">faq page</a>.</li>
                                <li style={{ textAlign: "left" }}>Once you have done something for someone else, give this person your coin and tell them to do something for someone else.</li>
                                <li style={{ textAlign: "left" }}>Using the code you wrote down in step 1, log <em>where</em> you did this act of service on <a href="/#action">this page</a>. You can view how far the coin has traveled on <a href="/#map">this page</a>.</li>
                            </ol>
                            <p><em>(You can view the <a href="/#faq">faq page</a> to check how soon your action will be updated on the map)</em></p>
                            <div className="cta-buttons">
                                <button className="cta-button" onClick={() => navigate("/#action")}>Log your action</button>
                                <button className="cta-button" onClick={() => navigate("/#map")}>View the map</button>
                                <button className="cta-button" onClick={() => navigate("/#about")}>About page</button>
                                <button className="cta-button" onClick={() => navigate("/#faq")}>View FAQ</button>
                            </div>
                        </div>
                        <div className="col-sm-2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
