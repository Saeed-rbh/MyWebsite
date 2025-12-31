
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from '../PDF/ResumePDF';

const DownloadButton = ({ cvData }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <span style={{
            textDecoration: 'none',
            color: '#000000', // Black text
            backgroundColor: '#f0f0f0', // Light background
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
        }}>
            <PDFDownloadLink
                document={<ResumePDF cvData={cvData} />}
                fileName="Saeed_Arabha_CV.pdf"
            >
                {({ loading }) =>
                    loading ? 'Loading...' : 'Download PDF'
                }
            </PDFDownloadLink>
        </span>
    );
};

export default DownloadButton;
