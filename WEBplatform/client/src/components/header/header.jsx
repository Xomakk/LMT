import Logo from "./logo";
import Profile from "./profile";
import Notice from "./notice";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div className="Wrapper">
            <header className="header">
                <div className="header__container">
                    <div className="header__row">
                        <div className="header__item">
                            <Link to="/">
                                <Logo />
                            </Link>
                        </div>
                        <div className="header__item">
                            <div className="header__profile">
                            <Notice />
                            <Profile />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;