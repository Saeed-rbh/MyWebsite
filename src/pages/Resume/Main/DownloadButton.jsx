import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from '../PDF/ResumePDF';

const DownloadButton = ({ cvData, isMobile }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const desktopStyle = {
        textDecoration: 'none',
        color: '#000000', // Black text
        background: 'linear-gradient(to left, #faf5f312 0%, #ff7a3717 100%)',
        fontSize: '11px',
        fontWeight: '700', // Bold
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid rgb(153 153 153 / 40%)',
        padding: '5px 15px',
        borderRadius: '15px',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        lineHeight: '1',
        zIndex: 9999,
        cursor: 'pointer',
        opacity: 1,
        marginLeft: '10px',
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle'
    };

    const mobileStyle = {
        textDecoration: 'none',
        color: '#fff',
        background: 'linear-gradient(to left, #faf5f312 0%, #ff7a3717 100%)',
        fontSize: '13px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #d49d81ce',
        padding: '10px 15px',
        borderRadius: '28px',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        zIndex: 100,
        cursor: 'pointer',
        opacity: 1,
        marginRight: '1px',
        fontFamily: 'Rubik, sans-serif',
    };

    return (
        <span style={isMobile ? mobileStyle : desktopStyle}>
            <PDFDownloadLink
                document={<ResumePDF cvData={cvData} />}
                fileName="Saeed_Arabha_CV.pdf"
                style={{
                    background: 'linear-gradient(to right, #b96032 0%, #d4a58d 50%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textDecoration: 'none',
                    fontFamily: 'inherit',
                    fontWeight: 'inherit',
                }}
            >
                {({ loading }) =>
                    loading ? 'Loading...' : 'Download PDF'
                }
            </PDFDownloadLink>
        </span>
    );
};

export default DownloadButton;
