import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

function Layout() {
    return (
        <>
            <Header />
            <main className="min-h-3/4 flex-grow bg-gray-100 p-6">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default Layout;
