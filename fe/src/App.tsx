import React from 'react';
import Navbar from "./component/Navbar"
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignupPage from './component/Signup';
import UserSignin from './component/Signin';
import BinanceDepositDashboard from './component/Dashboard';
import AllLandingPageContent from './LandingPage/AllLandingPageContent';
import AllUserPageContent from './component/AllUserPageContent';
import TradingViewChart from './component/TradingView';
import WithdrawEthereum from './component/WithdrawEthereum';

const App: React.FC = () => {
    return (
        <>
            <div style={{
                margin: 0,
                padding: 0,
                width: '100%',
                backgroundColor: '#1E2329',
                fontFamily: 'Arial, sans-serif'
            }}>

                <BrowserRouter>
                    <Routes>
                        <Route path='/signup' element={<SignupPage />} />
                        <Route path='/signin' element={<UserSignin />} />
                        <Route path='/dashboard' element={<BinanceDepositDashboard />} />
                        {/* <Route path='/withdraw' element={<WithdrawEthereum />} /> */}
                        <Route path='/' element={<AllLandingPageContent />} />
                        <Route path='user' element={<AllUserPageContent />} />

                        {/* //tseting  */}
                        <Route path='chart' element={<TradingViewChart symbol="BTC" />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    );
};

export default App;