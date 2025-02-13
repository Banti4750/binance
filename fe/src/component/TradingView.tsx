import React, { useEffect, useRef } from "react";

const TradingViewChart = ({ symbol }: { symbol: string }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => {
            new (window as any).TradingView.widget({
                "container_id": container.current.id,
                "width": "100%",
                "height": "500",
                "symbol": `BINANCE:${symbol}USDT`,
                "interval": "D",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "hide_side_toolbar": false,
                "allow_symbol_change": true,
                "studies": ["RSI@tv-basicstudies"],
            });
        };
        document.body.appendChild(script);
    }, [symbol]);

    return <div ref={container} id="tradingview_chart"></div>;
};

export default TradingViewChart;
