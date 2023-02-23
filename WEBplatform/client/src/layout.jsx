import { Link, Outlet } from "react-router-dom";
import Header from "./components/header/header";
import Menu from "./components/menu/menu";

function Layout() {
    
    return(
        <>
        <Header />

        <Menu />
        
        <div className="container">
            <Outlet />
        </div>
        
        {/* <Footer /> */}
        </>
    );
};

export {Layout};