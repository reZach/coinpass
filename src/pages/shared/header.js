function Header(props) {
    return (
        <div className="text-white bg-clay">
            <div className="container">
                <header className="d-flex justify-content-center py-3">
                    ALPHA BUILD
                    <ul className="nav nav-pills">
                        <li className="nav-item"><a href="/" className={"nav-link bold " + (props.page === "start" ? "active" : "")}>Home</a></li>
                        <li className="nav-item"><a href="/#map" className={"nav-link bold " + (props.page === "map" ? "active" : "")}>Map</a></li>
                        <li className="nav-item"><a href="/#action" className={"nav-link bold " + (props.page === "action" ? "active" : "")}>Action</a></li>
                        <li className="nav-item"><a href="/#stats" className={"nav-link bold " + (props.page === "stats" ? "active" : "")}>Stats</a></li>
                        <li className="nav-item"><a href="/#faq" className={"nav-link bold " + (props.page === "faq" ? "active" : "")}>FAQ</a></li>
                    </ul>
                    ALPHA BUILD
                </header>
            </div>
        </div>
    );
}

export default Header;
