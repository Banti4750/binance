import BinanceFAQ from "./BiannceFaq"
import DownLoad from "./DownLoad"
import Footer from "./Footer"
import HeroSection from "./HeroSection"
import Navbar from "./Navbar"


const AllLandingPageContent = () => {
    return (
        <>
            <Navbar />
            <HeroSection />
            <DownLoad />
            <BinanceFAQ />
            <Footer />
        </>
    )
}

export default AllLandingPageContent