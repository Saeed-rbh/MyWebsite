import React, { useEffect, useState } from 'react';

import { getCVData, updateCVSection, syncScholarData, uploadFile } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import { FaUserShield, FaChartBar, FaFileAlt, FaSignOutAlt, FaSave, FaLayerGroup, FaTrash, FaPlus, FaSpinner, FaCloudUploadAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

// Helper to format field labels, especially for PersonalInfo section
const formatLabel = (key) => {
    switch (key) {
        case 'name':
            return 'Name';
        case 'dateOfBirth':
            return 'Date of Birth';
        case 'caPhone':
            return 'CA Phone';
        case 'irPhone':
            return 'IR Phone';
        case 'pdf':
            return 'PDF File';
        default:
            return key;
    }
};

const AdminDashboard = () => {
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [sectionItems, setSectionItems] = useState([]);
    const [view, setView] = useState('dashboard');
    const [isSyncing, setIsSyncing] = useState(false);
    const [scholarUrl, setScholarUrl] = useState(''); // State for custom scholar URL
    const [uploadingIndex, setUploadingIndex] = useState(null); // Track which item is uploading

    // Delete Confirmation State
    const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { show: true, index: 1 }

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const { data } = await getCVData();
            setSections(data.sort((a, b) => a.id - b.id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (section) => {
        let items = section.list || [];
        if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch (e) { items = []; }
        }
        // Ensure every item has a unique ID for React keys
        items = items.map((item, idx) => ({
            ...item,
            id: item.id || (Date.now() + idx)
        }));

        setSelectedSection(section);
        setSectionItems(items);
        setView('editor');
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...sectionItems];
        newItems[index] = { ...newItems[index], [field]: value };
        // Auto‑generate href for ResearchInterests when label changes
        if (field === 'label' && selectedSection?.name === 'ResearchInterests') {
            const autoHref = '#' + value.replace(/\s+/g, '');
            newItems[index] = { ...newItems[index], href: autoHref };
        }
        setSectionItems(newItems);
    };

    const handleFileUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadingIndex(index);
        try {
            const { data } = await uploadFile(formData); // Expect { filePath: '...', fileName: '...' }
            // Update items: set 'pdf' field AND 'link' field (as paper link)
            const newItems = [...sectionItems];
            newItems[index] = {
                ...newItems[index],
                pdf: data.filePath,
                link: data.filePath // Auto-set link to the uploaded PDF
            };
            setSectionItems(newItems);
            alert('PDF Uploaded Successfully!');
        } catch (err) {
            console.error(err);
            alert('Upload failed: ' + err.message);
        } finally {
            setUploadingIndex(null);
            // Reset input
            e.target.value = null;
        }
    };

    const handleAddItem = () => {
        let template = {};
        if (sectionItems.length > 0) {
            Object.keys(sectionItems[0]).forEach(key => (template[key] = ''));
            template.id = Date.now();
        } else {
            template = { id: Date.now(), title: 'New Item', Date: '', Location: '' };
        }
        setSectionItems([...sectionItems, template]);
    };

    const handleDeleteItem = (index) => {
        // Show custom modal
        setDeleteConfirmation({ show: true, index });
    };

    const confirmDelete = () => {
        if (deleteConfirmation) {
            const index = deleteConfirmation.index;
            const newItems = sectionItems.filter((_, i) => i !== index);
            setSectionItems(newItems);
            setDeleteConfirmation(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation(null);
    };

    const handleSave = async () => {
        try {
            const updatedData = { ...selectedSection, list: sectionItems };
            await updateCVSection(selectedSection.id, updatedData);
            alert('Saved successfully!');
            fetchData();
        } catch (err) {
            alert('Error saving: ' + err.message);
        }
    };

    const handleSyncScholar = async () => {
        // Use default if empty
        const urlToSync = scholarUrl;

        console.log('Starting sync...');
        // Removed window.confirm as it might be blocked
        setIsSyncing(true);
        try {
            console.log('Sending sync request');
            const res = await syncScholarData(urlToSync);

            // Refresh data AND update current view
            const { data } = await getCVData();
            setSections(data.sort((a, b) => a.id - b.id));

            if (selectedSection) {
                const updatedSection = data.find(s => s.id === selectedSection.id);
                if (updatedSection) {
                    setSelectedSection(updatedSection);
                    let items = updatedSection.list || [];
                    if (typeof items === 'string') {
                        try { items = JSON.parse(items); } catch (e) { items = []; }
                    }
                    items = items.map((item, idx) => ({ ...item, id: item.id || (Date.now() + idx) }));
                    setSectionItems(items);
                }
            }
            alert(res.data.message);
        } catch (err) {
            alert('Sync failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsSyncing(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const totalSections = sections.length;
    const totalItems = sections.reduce((acc, cur) => {
        let list = cur.list;
        if (typeof list === 'string') {
            try { list = JSON.parse(list); } catch (e) { list = []; }
        }
        return acc + (Array.isArray(list) ? list.length : 0);
    }, 0);

    // Calculate Research Stats
    const getResearchStats = () => {
        if (!selectedSection || (selectedSection.name !== 'Papers' && selectedSection.name !== 'Published Papers')) return null;

        const papers = sectionItems;
        const totalPapers = papers.length;

        // Debugging logs
        console.log('Calculating stats for:', papers.length, 'papers');

        // Calculate Total Citations
        const totalCitations = papers.reduce((sum, paper) => {
            // citations might be "5", "Cited by 5", or just 5 (number)
            // Handle both lowercase and capitalized keys
            let rawCite = paper.citations !== undefined ? paper.citations : paper.Citations;
            if (rawCite === undefined || rawCite === null) rawCite = '0';

            const citeString = rawCite.toString().replace(/\D/g, ''); // Remove non-digits
            const citeCount = parseInt(citeString || '0', 10);

            // Limited logging to avoid flooding
            if (sum < 5) console.log(`Paper: ${paper.title || paper.Title || 'Untitled'} | Raw Cite: ${rawCite} | Parsed: ${citeCount}`);
            return sum + citeCount;
        }, 0);

        // Calculate H-index
        const citationsArray = papers.map(p => {
            let rawCite = p.citations !== undefined ? p.citations : p.Citations;
            if (rawCite === undefined || rawCite === null) rawCite = '0';
            return parseInt(rawCite.toString().replace(/\D/g, '') || '0', 10);
        });

        citationsArray.sort((a, b) => b - a); // Descending sort
        console.log('Citations Array (Desc):', citationsArray);

        let hIndex = 0;
        for (let i = 0; i < citationsArray.length; i++) {
            if (citationsArray[i] >= i + 1) {
                hIndex = i + 1;
            } else {
                break;
            }
        }

        return { totalPapers, totalCitations, hIndex };
    };

    const stats = getResearchStats();

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.backgroundImage} />

            {/* Custom Delete Confirmation Modal */}
            {deleteConfirmation && deleteConfirmation.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalIcon}><FaTrash /></div>
                        <h3 className={styles.modalTitle}>Delete Item?</h3>
                        <p className={styles.modalText}>
                            Are you sure you want to remove this item? <br />
                            This action cannot be undone after saving.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={cancelDelete}>Cancel</button>
                            <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <FaUserShield className={styles.logoIcon} />
                    <div className={styles.headerTitle}>AdminSuite</div>
                </div>
                <ul className={styles.navMenu}>
                    <div className={styles.menuLabel}>Main</div>
                    <li
                        className={`${styles.navItem} ${view === 'dashboard' ? styles.active : ''}`}
                        onClick={() => { setView('dashboard'); setSelectedSection(null); }}
                    >
                        <MdDashboard /> Dashboard
                    </li>
                    <div className={styles.menuLabel}>Content Sections</div>
                    {sections.map(sec => (
                        <li
                            key={sec.id}
                            className={`${styles.navItem} ${selectedSection?.id === sec.id ? styles.active : ''}`}
                            onClick={() => handleEdit(sec)}
                        >
                            <FaLayerGroup /> {sec.title}
                        </li>
                    ))}
                </ul>
                <div className={styles.logoutSection}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>
            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <div className={styles.pageTitle}>
                        {view === 'dashboard' ? 'Overview' : 'Content Editor'}
                    </div>
                    <div className={styles.userInfo}>
                        <span>Admin User</span>
                        <div className={styles.avatar}>A</div>
                    </div>
                </div>
                <div className={styles.contentScrollArea}>
                    {view === 'dashboard' ? (
                        <>
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}><FaFileAlt /></div>
                                    <div className={styles.statInfo}>
                                        <h4>Total Sections</h4>
                                        <h2>{totalSections}</h2>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}><FaChartBar /></div>
                                    <div className={styles.statInfo}>
                                        <h4>Total Entries</h4>
                                        <h2>{totalItems}</h2>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '50px', color: '#ccc' }}>
                                <h3>Select a section to begin editing</h3>
                            </div>
                        </>
                    ) : (
                        selectedSection && (
                            <div className={styles.editorWrapper}>
                                {stats && (
                                    <div className={styles.statsGrid} style={{ marginBottom: '20px' }}>
                                        <div className={styles.statCard}>
                                            <div className={styles.statIcon} style={{ background: 'rgba(0, 210, 255, 0.15)', color: '#00d2ff' }}>
                                                <FaFileAlt />
                                            </div>
                                            <div className={styles.statInfo}>
                                                <h4>Total Papers</h4>
                                                <h2>{stats.totalPapers}</h2>
                                            </div>
                                        </div>
                                        <div className={styles.statCard}>
                                            <div className={styles.statIcon} style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71' }}>
                                                <FaChartBar />
                                            </div>
                                            <div className={styles.statInfo}>
                                                <h4>Total Citations</h4>
                                                <h2>{stats.totalCitations}</h2>
                                            </div>
                                        </div>
                                        <div className={styles.statCard}>
                                            <div className={styles.statIcon} style={{ background: 'rgba(241, 196, 15, 0.15)', color: '#f1c40f' }}>
                                                <FaUserShield />
                                            </div>
                                            <div className={styles.statInfo}>
                                                <h4>H-index</h4>
                                                <h2>{stats.hIndex}</h2>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.sectionHeader}>
                                    <input
                                        className={styles.sectionTitleInput}
                                        value={selectedSection.title}
                                        onChange={e => setSelectedSection({ ...selectedSection, title: e.target.value })}
                                    />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={handleSave} className={styles.saveBtn}>
                                            <FaSave /> Save Changes
                                        </button>
                                        {(selectedSection.name === 'Papers' || selectedSection.name === 'Published Papers') && (
                                            <>
                                                <input
                                                    type="text"
                                                    placeholder="Google Scholar URL (Optional)"
                                                    value={scholarUrl}
                                                    onChange={(e) => setScholarUrl(e.target.value)}
                                                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginRight: '10px', width: '250px' }}
                                                />
                                                <button
                                                    onClick={handleSyncScholar}
                                                    disabled={isSyncing}
                                                    style={{ padding: '10px 20px', background: 'rgba(255, 165, 0, 0.2)', color: 'orange', border: '1px solid orange', borderRadius: '8px', cursor: isSyncing ? 'not-allowed' : 'pointer', opacity: isSyncing ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
                                                >
                                                    {isSyncing ? <><FaSpinner className="spin" /> Syncing...</> : <><FaPlus /> Sync G-Scholar</>}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.itemsList}>
                                    {sectionItems.map((item, index) => (
                                        <div key={item.id || index} className={styles.itemCard}>
                                            <button
                                                type="button"
                                                className={styles.deleteBtn}
                                                onClick={() => handleDeleteItem(index)}
                                            >
                                                <FaTrash />
                                            </button>

                                            {/* Upload Button for Papers */}
                                            {(selectedSection.name === 'Papers' || selectedSection.name === 'Published Papers') && (
                                                <div style={{ position: 'absolute', top: '10px', right: '50px' }}>
                                                    <input
                                                        type="file"
                                                        id={`upload-${index}`}
                                                        style={{ display: 'none' }}
                                                        accept="application/pdf"
                                                        onChange={(e) => handleFileUpload(e, index)}
                                                    />
                                                    <label
                                                        htmlFor={`upload-${index}`}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '5px',
                                                            background: '#2c3e50', color: '#fff',
                                                            padding: '5px 10px', borderRadius: '4px',
                                                            cursor: 'pointer', fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        {uploadingIndex === index ? <FaSpinner className="spin" /> : <FaCloudUploadAlt />}
                                                        {item.pdf ? 'Replace PDF' : 'Upload PDF'}
                                                    </label>
                                                    {item.pdf && (
                                                        <a href={`http://localhost:5000${item.pdf}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'right', fontSize: '0.7rem', color: '#3498db', marginTop: '2px' }}>
                                                            View PDF
                                                        </a>
                                                    )}
                                                </div>
                                            )}

                                            <div className={styles.fieldGrid}>
                                                {Object.entries(item).map(([key, value]) => {
                                                    if (key === 'id') return null;
                                                    const isArray = Array.isArray(value);
                                                    const isAutoGenerated = (selectedSection.name === 'ResearchInterests' && key === 'href');
                                                    const displayValue = isArray ? JSON.stringify(value) : value;
                                                    return (
                                                        <div key={key} className={styles.fieldGroup}>
                                                            <label className={styles.fieldLabel}>{formatLabel(key)}</label>
                                                            {key === 'skill' && Array.isArray(value) ? (
                                                                <div className={styles.skillEditor}>
                                                                    {value.map((skillPair, sIndex) => (
                                                                        <div key={sIndex} className={styles.skillRow}>
                                                                            <input
                                                                                className={styles.skillNameInput}
                                                                                value={skillPair[0]}
                                                                                onChange={(e) => {
                                                                                    const newSkills = [...value];
                                                                                    newSkills[sIndex] = [e.target.value, skillPair[1]];
                                                                                    handleItemChange(index, key, newSkills);
                                                                                }}
                                                                                placeholder="Skill Name"
                                                                            />
                                                                            <select
                                                                                className={styles.skillLevelSelect}
                                                                                value={skillPair[1]}
                                                                                onChange={(e) => {
                                                                                    const newSkills = [...value];
                                                                                    newSkills[sIndex] = [skillPair[0], e.target.value];
                                                                                    handleItemChange(index, key, newSkills);
                                                                                }}
                                                                            >
                                                                                <option value="Beginner">Beginner</option>
                                                                                <option value="Intermediate">Intermediate</option>
                                                                                <option value="Advanced">Advanced</option>
                                                                                <option value="Expert">Expert</option>
                                                                            </select>
                                                                            <button
                                                                                className={styles.removeSkillBtn}
                                                                                onClick={() => {
                                                                                    const newSkills = value.filter((_, i) => i !== sIndex);
                                                                                    handleItemChange(index, key, newSkills);
                                                                                }}
                                                                            >
                                                                                <FaTrash />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    <button
                                                                        className={styles.addSkillBtn}
                                                                        onClick={() => {
                                                                            const newSkills = [...value, ["New Skill", "Beginner"]];
                                                                            handleItemChange(index, key, newSkills);
                                                                        }}
                                                                    >
                                                                        <FaPlus /> Add Skill
                                                                    </button>
                                                                </div>
                                                            ) : (selectedSection.name === 'Qualifications' && (key === 'Date' || key === 'Supervisor')) ? (
                                                                <div className={styles.splitFieldContainer}>
                                                                    <input
                                                                        className={styles.fieldInput}
                                                                        placeholder={key === 'Date' ? 'Start Date' : 'Supervisor 1'}
                                                                        value={key === 'Date' ? (value.split(/ – | - /)[0] || '') : (value.split(', ')[0] || '')}
                                                                        onChange={e => {
                                                                            const parts = key === 'Date' ? value.split(/ – | - /) : value.split(', ');
                                                                            const newPart1 = e.target.value;
                                                                            const newPart2 = parts[1] || '';
                                                                            const separator = key === 'Date' ? ' – ' : ', ';
                                                                            handleItemChange(index, key, `${newPart1}${separator}${newPart2}`);
                                                                        }}
                                                                    />
                                                                    <input
                                                                        className={styles.fieldInput}
                                                                        placeholder={key === 'Date' ? 'End Date' : 'Supervisor 2'}
                                                                        value={key === 'Date' ? (value.split(/ – | - /)[1] || '') : (value.split(', ')[1] || '')}
                                                                        onChange={e => {
                                                                            const parts = key === 'Date' ? value.split(/ – | - /) : value.split(', ');
                                                                            const newPart1 = parts[0] || '';
                                                                            const newPart2 = e.target.value;
                                                                            const separator = key === 'Date' ? ' – ' : ', ';
                                                                            handleItemChange(index, key, `${newPart1}${separator}${newPart2}`);
                                                                        }}
                                                                    />
                                                                </div>
                                                            ) : isArray ? (
                                                                <input
                                                                    className={styles.fieldInput}
                                                                    value={displayValue}
                                                                    onChange={e => {
                                                                        try {
                                                                            const parsed = JSON.parse(e.target.value);
                                                                            handleItemChange(index, key, parsed);
                                                                        } catch (_) { }
                                                                    }}
                                                                    placeholder="Complex Array Data"
                                                                />
                                                            ) : (
                                                                <input
                                                                    className={styles.fieldInput}
                                                                    value={displayValue !== undefined && displayValue !== null ? displayValue : ''}
                                                                    onChange={e => handleItemChange(index, key, e.target.value)}
                                                                    readOnly={isAutoGenerated}
                                                                    style={isAutoGenerated ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className={styles.addBtn} onClick={handleAddItem}>
                                    <FaPlus /> Add New Item
                                </button>
                            </div>
                        )
                    )}
                </div >
            </div >
        </div >
    );
};

export default AdminDashboard;
