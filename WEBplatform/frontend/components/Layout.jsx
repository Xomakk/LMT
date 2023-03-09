import Header from '@/components/Header';
import Footer from '@/components/Footer';


const Layout = ({ children }) => (
    <>
        <Header body={children}/>
        <Footer />
    </>
);


export default Layout;