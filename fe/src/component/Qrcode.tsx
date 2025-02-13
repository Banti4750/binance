import React, { useState, useEffect } from "react";
import axios from "axios";

interface QRCodeGeneratorProps {
    qrData: string; // Use a more descriptive prop name
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ qrData }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the QR code image
        const fetchQRCode = async () => {
            if (!qrData) {
                setError("No data provided for QR code.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`,
                    {
                        responseType: "blob", // Fetch the image as a blob
                    }
                );

                // Convert the blob to a URL
                const imageUrl = URL.createObjectURL(response.data);
                setQrCodeUrl(imageUrl);
                setError(null);
            } catch (error) {
                console.error("Error fetching QR code:", error);
                setError("Failed to generate QR code.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchQRCode();
    }, [qrData]); // Add qrData to the dependency array

    return (
        <div>
            {isLoading ? (
                <p>Loading QR Code...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <img src={qrCodeUrl} alt="QR Code" />
            )}
        </div>
    );
};

export default QRCodeGenerator;