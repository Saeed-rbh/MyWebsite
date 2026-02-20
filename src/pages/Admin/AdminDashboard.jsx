import React, { useEffect, useState, useCallback } from 'react';

import { getCVData, updateCVSection, syncScholarData, uploadFile } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import {
    FaUserShield, FaChartBar, FaFileAlt, FaSignOutAlt, FaSave, FaLayerGroup,
    FaTrash, FaPlus, FaSpinner, FaCloudUploadAlt, FaCheck, FaTimes,
    FaChevronDown, FaChevronUp, FaGraduationCap, FaAward, FaBriefcase,
    FaFlask, FaCog, FaUser, FaBook, FaCalendarAlt, FaSyncAlt, FaExternalLinkAlt,
    FaAddressBook, FaHome, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { Reorder, useDragControls } from 'framer-motion';
import CVItem from './CVItem';

// Helper to format field labels
const formatLabel = (key) => {
    const labels = {
        name: 'Full Name',
        Name: 'Full Name',
        dateOfBirth: 'Date of Birth',
        caPhone: 'Canada Phone',
        irPhone: 'Iran Phone',
        pdf: 'PDF File',
        Title: 'Title',
        title: 'Title',
        Date: 'Date Range',
        Location: 'Location',
        Thesis: 'Thesis/Project',
        Supervisor: 'Supervisor(s)',
        Citations: 'Citations',
        citations: 'Citations',
        Authors: 'Authors (Text)',
        AuthorsList: 'Authors',
        Journal: 'Journal',
        Year: 'Year',
        Link: 'Link URL',
        link: 'Link URL',
        Award: 'Award Description',
        Conference: 'Conference Details',
        Teaching: 'Experience Details',
        skill: 'Skills',
        label: 'Label',
        href: 'Link (Auto)',
        category: 'Category',
        text: 'Main Text',
        info: 'Content/Value',
        degreeLabel: 'Degree Label',
        degree: 'Degree',
        hobbyLabel: 'Hobby Label',
        hobby: 'Hobby',
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

// Get icon for section
const getSectionIcon = (name) => {
    const icons = {
        PersonalInfo: FaUser,
        Affiliation: FaBriefcase,
        ResearchInterests: FaFlask,
        Skills: FaCog,
        Qualifications: FaGraduationCap,
        'Published Papers': FaBook,
        Papers: FaBook,
        Conference: FaCalendarAlt,
        Awards: FaAward,
        Teaching: FaBriefcase,
        ContactInfo: FaAddressBook,
        Home: FaHome,
    };
    return icons[name] || FaLayerGroup;
};

// Toast notification component
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${styles.toast} ${styles[`toast${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
            {type === 'success' ? <FaCheck /> : <FaTimes />}
            <span>{message}</span>
        </div>
    );
};

const AdminDashboard = () => {
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [sectionItems, setSectionItems] = useState([]);
    const [view, setView] = useState('dashboard');
    const [isSyncing, setIsSyncing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [scholarUrl, setScholarUrl] = useState('');
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Toast state
    const [toast, setToast] = useState(null);

    // Delete Confirmation State
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    const navigate = useNavigate();

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
        fetchData();
    }, [navigate]);

    // Keyboard shortcut for save (Ctrl+S)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && view === 'editor') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [view, selectedSection, sectionItems]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data } = await getCVData();
            setSections(data.sort((a, b) => a.id - b.id));
        } catch (err) {
            console.error(err);
            showToast('Failed to load data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (section) => {
        let items = section.list || [];
        if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch (e) { items = []; }
        }
        items = items.map((item, idx) => ({
            ...item,
            id: item.id || (Date.now() + idx)
        }));

        setSelectedSection(section);
        setSectionItems(items);
        setView('editor');
        setHasUnsavedChanges(false);
        // Expand first item by default
        if (items.length > 0) {
            setExpandedItems({ 0: true });
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...sectionItems];
        newItems[index] = { ...newItems[index], [field]: value };
        if (field === 'label' && selectedSection?.name === 'ResearchInterests') {
            const autoHref = '#' + value.replace(/\s+/g, '');
            newItems[index] = { ...newItems[index], href: autoHref };
        }
        setSectionItems(newItems);
        setHasUnsavedChanges(true);
    };

    const handleFileUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadingIndex(index);
        try {
            const { data } = await uploadFile(formData);
            const newItems = [...sectionItems];
            newItems[index] = {
                ...newItems[index],
                pdf: data.filePath,
                link: data.filePath
            };
            setSectionItems(newItems);
            setHasUnsavedChanges(true);
            showToast('PDF uploaded successfully!', 'success');
        } catch (err) {
            console.error(err);
            showToast('Upload failed: ' + err.message, 'error');
        } finally {
            setUploadingIndex(null);
            e.target.value = null;
        }
    };

    const handleAddItem = () => {
        let template = {};
        if (sectionItems.length > 0) {
            Object.keys(sectionItems[0]).forEach(key => {
                if (key === 'id') return;
                // Initialize arrays as empty arrays, others as empty strings
                if (Array.isArray(sectionItems[0][key])) {
                    template[key] = [];
                } else {
                    template[key] = '';
                }
            });
            template.id = Date.now();
        } else {
            template = { id: Date.now(), title: 'New Item', Date: '', Location: '', skill: [] };
        }
        const newItems = [...sectionItems, template];
        setSectionItems(newItems);
        setHasUnsavedChanges(true);
        // Expand the new item
        setExpandedItems({ ...expandedItems, [newItems.length - 1]: true });
    };

    const moveSkill = (itemIndex, key, skillIndex, direction) => {
        const newItems = [...sectionItems];
        const skills = [...newItems[itemIndex][key]];

        if (direction === 'up' && skillIndex > 0) {
            [skills[skillIndex], skills[skillIndex - 1]] = [skills[skillIndex - 1], skills[skillIndex]];
        } else if (direction === 'down' && skillIndex < skills.length - 1) {
            [skills[skillIndex], skills[skillIndex + 1]] = [skills[skillIndex + 1], skills[skillIndex]];
        }

        newItems[itemIndex][key] = skills;
        setSectionItems(newItems);
        setHasUnsavedChanges(true);
    };

    const moveItem = (index, direction) => {
        const newItems = [...sectionItems];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }
        setSectionItems(newItems);
        setHasUnsavedChanges(true);
        // adjust expanded items if needed, or just let them stay as is (by index)
        // If we want to track expanded state by ID, we'd need to change expandedItems logic, 
        // but for now swapping data at indices is enough. 
        // Example: if index 0 is open and we swap 0 and 1, index 0 is still open (now showing what was at 1).
        // This is acceptable behavior for a simple list.
    };

    const handleDeleteItem = (index) => {
        setDeleteConfirmation({ show: true, index });
    };

    const confirmDelete = () => {
        if (deleteConfirmation) {
            const index = deleteConfirmation.index;
            const newItems = sectionItems.filter((_, i) => i !== index);
            setSectionItems(newItems);
            setDeleteConfirmation(null);
            setHasUnsavedChanges(true);
            showToast('Item removed', 'success');
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation(null);
    };

    const handleSave = async () => {
        if (!selectedSection) return;
        setIsSaving(true);
        try {
            const updatedData = { ...selectedSection, list: sectionItems };
            await updateCVSection(selectedSection.id, updatedData);
            showToast('Changes saved successfully!', 'success');
            setHasUnsavedChanges(false);
            fetchData();
        } catch (err) {
            showToast('Error saving: ' + err.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSyncScholar = async () => {
        const urlToSync = scholarUrl;
        setIsSyncing(true);
        try {
            const res = await syncScholarData(urlToSync);
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
            showToast(res.data.message, 'success');
        } catch (err) {
            showToast('Sync failed: ' + (err.response?.data?.message || err.message), 'error');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleLogout = () => {
        if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to logout?')) {
            return;
        }
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleItemExpand = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const getItemPreview = (item) => {
        // Get a preview text for collapsed items
        const title = item.Title || item.title || item.name || item.Name || item.Award || item.Conference || item.Teaching || item.label || item.category || item.info || '';
        return title.length > 60 ? title.substring(0, 60) + '...' : title || 'Untitled Item';
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

        const totalCitations = papers.reduce((sum, paper) => {
            let rawCite = paper.citations !== undefined ? paper.citations : paper.Citations;
            if (rawCite === undefined || rawCite === null) rawCite = '0';
            const citeString = rawCite.toString().replace(/\D/g, '');
            return sum + parseInt(citeString || '0', 10);
        }, 0);

        const citationsArray = papers.map(p => {
            let rawCite = p.citations !== undefined ? p.citations : p.Citations;
            if (rawCite === undefined || rawCite === null) rawCite = '0';
            return parseInt(rawCite.toString().replace(/\D/g, '') || '0', 10);
        });
        citationsArray.sort((a, b) => b - a);

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

    // Get item count for each section
    const getItemCount = (section) => {
        let list = section.list;
        if (typeof list === 'string') {
            try { list = JSON.parse(list); } catch (e) { list = []; }
        }
        return Array.isArray(list) ? list.length : 0;
    };


    const renderField = (key, value, index) => {
        const isArray = Array.isArray(value);
        const isAutoGenerated = (selectedSection.name === 'ResearchInterests' && key === 'href');
        const displayValue = isArray ? JSON.stringify(value) : value;

        if (key === 'skill' && Array.isArray(value)) {
            return (
                <div className={styles.skillEditor}>
                    {value.map((skillPair, sIndex) => (
                        <div key={sIndex} className={styles.skillRow}>
                            <div className={styles.skillReorder}>
                                <button
                                    onClick={() => moveSkill(index, key, sIndex, 'up')}
                                    disabled={sIndex === 0}
                                    className={styles.reorderBtn}
                                    title="Move Up"
                                >
                                    <FaArrowUp />
                                </button>
                                <button
                                    onClick={() => moveSkill(index, key, sIndex, 'down')}
                                    disabled={sIndex === value.length - 1}
                                    className={styles.reorderBtn}
                                    title="Move Down"
                                >
                                    <FaArrowDown />
                                </button>
                            </div>
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
            );
        }

        if (selectedSection.name === 'Qualifications' && (key === 'Date' || key === 'Supervisor')) {
            return (
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
            );
        }

        if (key === 'AuthorsList' && Array.isArray(value)) {
            return (
                <div className={styles.authorsEditor}>
                    {value.map((author, aIndex) => (
                        <div key={aIndex} className={styles.authorRow}>
                            <input
                                className={styles.authorInput}
                                value={author}
                                onChange={(e) => {
                                    const newAuthors = [...value];
                                    newAuthors[aIndex] = e.target.value;
                                    handleItemChange(index, key, newAuthors);
                                    handleItemChange(index, 'Authors', newAuthors.join(', '));
                                }}
                                placeholder={`Author ${aIndex + 1}`}
                            />
                            <button
                                className={styles.removeAuthorBtn}
                                onClick={() => {
                                    const newAuthors = value.filter((_, i) => i !== aIndex);
                                    handleItemChange(index, key, newAuthors);
                                    handleItemChange(index, 'Authors', newAuthors.join(', '));
                                }}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                    <button
                        className={styles.addAuthorBtn}
                        onClick={() => {
                            const newAuthors = [...value, 'New Author'];
                            handleItemChange(index, key, newAuthors);
                            handleItemChange(index, 'Authors', newAuthors.join(', '));
                        }}
                    >
                        <FaPlus /> Add Author
                    </button>
                </div>
            );
        }

        if (isArray) {
            return (
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
            );
        }

        if ((key === 'degreeLabel' || key === 'degree' || key === 'hobbyLabel' || key === 'hobby') && selectedSection.name === 'Home') {
            return (
                <div className={styles.fieldGroup}>
                    <input
                        className={styles.fieldInput}
                        value={displayValue !== undefined && displayValue !== null ? displayValue : ''}
                        onChange={e => handleItemChange(index, key, e.target.value)}
                        placeholder={formatLabel(key)}
                    />
                </div>
            );
        }

        if (key === 'text' && selectedSection.name === 'Home') {
            return (
                <div className={styles.textAreaWrapper}>
                    <textarea
                        className={styles.fieldTextArea}
                        value={displayValue !== undefined && displayValue !== null ? displayValue : ''}
                        onChange={e => {
                            if (e.target.value.length <= 500) {
                                handleItemChange(index, key, e.target.value);
                            }
                        }}
                        placeholder="Enter main text here. Use $(Text to Highlight) for gradient effect."
                        rows={6}
                    />
                    <span className={styles.charCount}>
                        {(displayValue || '').length}/500
                    </span>
                </div>
            );
        }

        return (
            <input
                className={styles.fieldInput}
                value={displayValue !== undefined && displayValue !== null ? displayValue : ''}
                onChange={e => handleItemChange(index, key, e.target.value)}
                readOnly={isAutoGenerated}
                style={isAutoGenerated ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            />
        );
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.backgroundImage} />

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Delete Confirmation Modal */}
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
                    <div className={styles.headerTitle}>Website Manager</div>
                </div>
                <ul className={styles.navMenu}>
                    <div className={styles.menuLabel}>Overview</div>
                    <li
                        className={`${styles.navItem} ${view === 'dashboard' ? styles.active : ''}`}
                        onClick={() => { setView('dashboard'); setSelectedSection(null); }}
                    >
                        <MdDashboard /> Dashboard
                    </li>
                    <div className={styles.menuLabel}>Content Sections</div>
                    {isLoading ? (
                        <div className={styles.loadingNav}>
                            <FaSpinner className={styles.spin} /> Loading...
                        </div>
                    ) : (
                        sections.map(sec => {
                            const IconComponent = getSectionIcon(sec.name);
                            const itemCount = getItemCount(sec);
                            return (
                                <li
                                    key={sec.id}
                                    className={`${styles.navItem} ${selectedSection?.id === sec.id ? styles.active : ''}`}
                                    onClick={() => handleEdit(sec)}
                                >
                                    <IconComponent />
                                    <span className={styles.navText}>{sec.title}</span>
                                    {itemCount > 0 && (
                                        <span className={styles.itemBadge}>{itemCount}</span>
                                    )}
                                </li>
                            );
                        })
                    )}
                </ul>
                <div className={styles.logoutSection}>
                    <button onClick={() => navigate('/')} className={styles.websiteBtn}>
                        <FaExternalLinkAlt /> Go to Website
                    </button>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <div className={styles.pageTitleArea}>
                        <div className={styles.pageTitle}>
                            {view === 'dashboard' ? 'Dashboard' : selectedSection?.title || 'Editor'}
                        </div>
                        {hasUnsavedChanges && (
                            <span className={styles.unsavedBadge}>Unsaved Changes</span>
                        )}
                    </div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Admin</span>
                        <div className={styles.avatar}>A</div>
                    </div>
                </div>

                <div className={styles.contentScrollArea}>
                    {view === 'dashboard' ? (
                        <div className={styles.dashboardContent}>
                            <div className={styles.welcomeCard}>
                                <h2>Welcome to Website Manager</h2>
                                <p>Select a section from the sidebar to edit your website content.</p>
                            </div>
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
                            <div className={styles.quickLinks}>
                                <h3>Quick Access</h3>
                                <div className={styles.quickLinksGrid}>
                                    {sections.map(sec => {
                                        const IconComponent = getSectionIcon(sec.name);
                                        return (
                                            <div
                                                key={sec.id}
                                                className={styles.quickLinkCard}
                                                onClick={() => handleEdit(sec)}
                                            >
                                                <IconComponent className={styles.quickLinkIcon} />
                                                <span>{sec.title}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        selectedSection && (
                            <div className={styles.editorWrapper}>
                                {stats && (
                                    <div className={styles.statsGrid}>
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
                                                <FaAward />
                                            </div>
                                            <div className={styles.statInfo}>
                                                <h4>H-index</h4>
                                                <h2>{stats.hIndex}</h2>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.sectionHeader}>
                                    <div className={styles.sectionTitleArea}>
                                        <input
                                            className={styles.sectionTitleInput}
                                            value={selectedSection.title}
                                            onChange={e => {
                                                setSelectedSection({ ...selectedSection, title: e.target.value });
                                                setHasUnsavedChanges(true);
                                            }}
                                            placeholder="Section Title"
                                        />
                                        <span className={styles.itemCount}>{sectionItems.length} items</span>
                                    </div>
                                    <div className={styles.headerActions}>
                                        <button
                                            onClick={handleSave}
                                            className={styles.saveBtn}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? <FaSpinner className={styles.spin} /> : <FaSave />}
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                                {(selectedSection.name === 'Papers' || selectedSection.name === 'Published Papers') && (
                                    <div className={styles.scholarRow}>
                                        <input
                                            type="text"
                                            placeholder="Google Scholar URL"
                                            value={scholarUrl}
                                            onChange={(e) => setScholarUrl(e.target.value)}
                                            className={styles.scholarInput}
                                        />
                                        <button
                                            onClick={handleSyncScholar}
                                            disabled={isSyncing}
                                            className={styles.syncBtn}
                                        >
                                            {isSyncing ? <FaSpinner className={styles.spin} /> : <FaSyncAlt />}
                                            {isSyncing ? 'Syncing...' : 'Sync Scholar'}
                                        </button>
                                    </div>
                                )}

                                <Reorder.Group
                                    axis="y"
                                    values={sectionItems}
                                    onReorder={(newOrder) => {
                                        setSectionItems(newOrder);
                                        setHasUnsavedChanges(true);
                                    }}
                                    className={styles.itemsList}
                                >
                                    {sectionItems.map((item, index) => (
                                        <CVItem
                                            key={item.id}
                                            item={item}
                                            index={index}
                                            expanded={expandedItems[index]}
                                            onToggleExpand={() => toggleItemExpand(index)}
                                            onMove={moveItem}
                                            onDelete={handleDeleteItem}
                                            onChange={handleItemChange}
                                            onUpload={handleFileUpload}
                                            isUploading={uploadingIndex === index ? index : null}
                                            selectedSectionName={selectedSection.name}
                                            getItemPreview={getItemPreview}
                                            totalItems={sectionItems.length}
                                            renderEditor={(item, idx) => (
                                                <div className={styles.fieldGrid}>
                                                    {Object.entries(item).map(([key, value]) => {
                                                        if (key === 'id') return null;
                                                        const isArray = Array.isArray(value);
                                                        const isAutoGenerated = (selectedSection.name === 'ResearchInterests' && key === 'href');
                                                        const displayValue = isArray ? JSON.stringify(value) : value;

                                                        return (
                                                            <div key={key} className={styles.fieldGroup}>
                                                                <label className={styles.fieldLabel}>{formatLabel(key)}</label>
                                                                {renderField(key, value, idx)}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        />
                                    ))}



                                </Reorder.Group>

                                <button className={styles.addBtn} onClick={handleAddItem}>
                                    <FaPlus /> Add New Item
                                </button>

                                {/* Keyboard shortcut hint */}
                                <div className={styles.keyboardHint}>
                                    Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div >
        </div >
    );
};

export default AdminDashboard;
