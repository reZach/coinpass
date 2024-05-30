function Header(props) {
    return (
        <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary bg-clay">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Good Samaritan Movement</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a href="/" className={"nav-link bold " + (props.page === "start" ? "active" : "")}>Home</a>
                        </li>
                        <li className="nav-item">
                            <a href="/#map" className={"nav-link bold " + (props.page === "map" ? "active" : "")}>Map</a>
                        </li>
                        <li className="nav-item">
                            <a href="/#action" className={"nav-link bold " + (props.page === "action" ? "active" : "")}>Action</a>
                        </li>
                        <li className="nav-item">
                            <a href="/#addcity" className={"nav-link bold " + (props.page === "addcity" ? "active" : "")}>Add city</a>
                        </li>
                        <li className="nav-item">
                            <a href="/#stats" className={"nav-link bold " + (props.page === "stats" ? "active" : "")}>Stats</a>
                        </li>
                        <li className="nav-item">
                            <a href="/#faq" className={"nav-link bold " + (props.page === "faq" ? "active" : "")}>FAQ</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
}

export default Header;
