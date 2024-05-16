function Header(props) {
    return (
        <div className="container text-white">
            <header className="d-flex justify-content-center py-3">
                <ul className="nav nav-pills">
                    <li className="nav-item"><a href="/start" className={"nav-link bold " + (props.page === "start" ? "active" : "")}>Home</a></li>
                    <li className="nav-item"><a href="/coinpass" className={"nav-link bold " + (props.page === "coinpass" ? "active" : "")}>Map</a></li>
                    <li className="nav-item"><a href="/action" className={"nav-link bold " + (props.page === "action" ? "active" : "")}>Action</a></li>
                </ul>
            </header>
        </div>
    );
}

export default Header;
