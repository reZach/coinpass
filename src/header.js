function Header() {

    return (
        <div className="container">
            <header className="d-flex justify-content-center py-3">
                <ul className="nav nav-pills">
                    <li className="nav-item"><a href="/start" className="nav-link active" aria-current="page">Home</a></li>
                    <li className="nav-item"><a href="/coinpass" className="nav-link">Map</a></li>
                    <li className="nav-item"><a href="/input" className="nav-link">Input</a></li>
                </ul>
            </header>
        </div>
    );
}

export default Header;
