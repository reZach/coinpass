import Header from "./shared/header";
import React, { useRef, useEffect, useState } from "react";
import Swal from "sweetalert2";

const supabase = require("@supabase/supabase-js");
const client = supabase.createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

function AddCity() {
    const [userCityToAdd, setUserCityToAdd] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [submitAnother, setSubmitAnother] = useState(false);

    const initialized = useRef(false);
    const captchaValue = useRef(undefined);

    useEffect(() => {
        async function init() {
            if (!initialized.current) {
                initialized.current = true;
            }

            captchaValue.current = await generateCaptcha();
        }
        init();
    }, []);

    const generateCaptcha = async function () {
        if (captchaValue.current !== undefined) {
            return;
        }

        var chars = "234679ACDEFGHJKLMNPQRTUVWXYZ";
        // You can include special characters by adding them to the string above, for eg: chars += "@#?<>";

        var string_length = 6; // This is the length of the Captcha    
        var ChangeCaptcha = "";
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            ChangeCaptcha += chars.substring(rnum, rnum + 1);
        }

        await document.fonts.ready;

        const canvas = document.getElementById("js-canvas");
        const context = canvas.getContext("2d");
        const center = canvas.width / 2;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000000";
        context.font = "32px \"Lato-Regular\"";
        context.textAlign = "center";
        context.fillText(ChangeCaptcha, center, 50);

        return ChangeCaptcha;
    }

    const refreshPage = (event) => {
        window.location.reload(); // eslint-disable-line no-use-before-define
    }


    const submit = async (event) => {
        event.preventDefault();

        if (userCityToAdd === "") {
            Swal.fire({
                title: "Invalid",
                text: "No user details present",
                icon: "error"
            });
            return;
        } else if (captcha !== captchaValue.current) {
            Swal.fire({
                title: "Invalid",
                text: "Invalid captcha",
                icon: "error"
            });
            return;
        }

        // insert record
        const { data, error } = await client
            .from("CitiesToAdd")
            .insert([
                { request: userCityToAdd },
            ])
            .select();

        setUserCityToAdd("");

        captchaValue.current = await generateCaptcha();
        setCaptcha("");
        setSubmitAnother(true);

        Swal.fire({
            title: "Success",
            text: "We'll review your submission, and work to add your city within a few working days.",
            icon: "success"
        });
        
        // prevent spamming the DB  
        // captchaValue.current = undefined; // Needed to set to regenerate the captcha value [with the line below]
        // captchaValue.current = await generateCaptcha();
        // setCaptcha(""); // Force user to re-enter the new value

        // Swal.fire({
        //     title: "Invalid",
        //     text: "We were unable to submit your details",
        //     icon: "error"
        // });
        // return;
    }

    const changeUserCityToAdd = (event) => {
        let newValue = event.target.value;

        if (newValue > 100){
            newValue = newValue.substring(0, 99);
        }

        setUserCityToAdd(newValue);
    }

    const changeCaptcha = (event) => {
        setCaptcha(event.target.value.toUpperCase());
    }

    return (
        <div className="App">
            <Header page={"addcity"} />
            <div className="container">
                <div className="row mt-4 mb-4">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8 col-12">
                        <h1 className="display-1 header">Request to have a city added</h1>
                        Trying to add an action on <a href="/#action">this page</a> but your city isn't listed?<br />
                        Enter in your details of your city below (ie. country, state/province) and we will work to get
                        your city added to the website.<br /><br />

                        <em>Note: Please see the <a href="#/faq">FAQ page</a> regarding how soon cities will be updated on the page.</em>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8 col-12">
                        <form className="needs-validation mb-2" onSubmit={submit}>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label text-start text-md-center">City to add</label>
                                <div className="col-sm-10">
                                    <textarea className="form-control" placeholder="Add details here such as the country and/or the state/province" value={userCityToAdd} onChange={changeUserCityToAdd} maxlength="100" required />
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label text-start text-md-center">Captcha</label>
                                <div className="col-sm-10">
                                    <canvas id="js-canvas" className="text-white" width="300" height="100"></canvas>
                                    <input type="text" className="form-control" placeholder="Enter captcha value above" value={captcha} onChange={changeCaptcha} required />
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary" type="submit" disabled={submitAnother ? "disabled" : ""}>Submit</button>
                            </div>
                        </form>
                        <div className="row mb-2" style={{ display: submitAnother ? "flex" : "none" }}>
                            <button className="btn btn-primary" type="button" onClick={refreshPage}>Click here to submit another</button>
                        </div>
                    </div>
                    <div className="col-sm-2"></div>
                </div>

            </div>

        </div>
    );
}
export default AddCity;
