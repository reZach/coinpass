import "./home.css";
import Header from "./shared/header";
import React from "react";

function Home() {

    const navigate = function (url) {
        window.location.href = url;
    }

    return (
        <div className="App">
            <Header page={"start"} />
            <div className="container">
                <div className="row">
                    <div className="row">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-8 col-12">
                            <h1 className="display-1 header">Good Samaritan Movement</h1>
                            <h4 style={{ marginBottom: "80px" }}>A project meant to inspire you by showing that even one small act of love can have a rippling effect across the world.</h4>
                            <h1 className="display-3 header">How does it work<span style={{ position: "relative", top: "-8px" }}>?</span></h1>
                            <p>If you have landed on this page, you have been given a coin.</p>
                            <ol style={{ listStyleType: "decimal" }}>
                                <li style={{ textAlign: "left" }}>Do something you would not normally do; to love or care for another person.</li>
                                <li style={{ textAlign: "left" }}>Once you have done this, give this person the coin and tell them do to the same for someone else.</li>
                                <li style={{ textAlign: "left" }}>Log <em>where</em> you did this act of service on <a href="/#action">this page</a>. You can view how far the coin has traveled on <a href="/#map">this page</a>.</li>
                            </ol>
                            <div className="cta-buttons">
                                <button className="cta-button" onClick={() => navigate("/#action")}>Log your action</button>
                                <button className="cta-button" onClick={() => navigate("/#map")}>View the map</button>
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