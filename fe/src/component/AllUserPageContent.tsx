import BinanceFAQ from "../LandingPage/BiannceFaq"
import Download from "../LandingPage/DownLoad"
import Footer from "../LandingPage/Footer"
import Navbar from "./Navbar"
import UserHero from "./UserHero"


const AllUserPageContent = () => {
    return (
        <>
            <Navbar />
            <UserHero />
            <Download />
            <BinanceFAQ />
            <Footer />
        </>
    )
}

export default AllUserPageContent