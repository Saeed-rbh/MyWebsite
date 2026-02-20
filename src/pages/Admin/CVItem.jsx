import React from 'react';
import { Reorder, useDragControls, motion, AnimatePresence } from 'framer-motion';
import {
    FaTrash, FaPlus, FaCloudUploadAlt, FaCheck, FaTimes,
    FaArrowUp, FaArrowDown, FaLayerGroup, FaChevronDown, FaChevronUp, FaSpinner
} from 'react-icons/fa';
import styles from './AdminDashboard.module.css';

const CVItem = ({
    item,
    index,
    expanded,
    onToggleExpand,
    onMove,
    onDelete,
    onUpload,
    isUploading,
    selectedSectionName,
    getItemPreview,
    renderEditor,
    totalItems
}) => {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={item}
            dragListener={false}
            dragControls={controls}
            className={`${styles.itemCard} ${expanded ? styles.expanded : ''}`}
            whileDrag={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 100 }}
            transition={{
                default: { type: "tween", duration: 0.2, ease: "easeOut" },
                layout: { type: "tween", duration: 0.2, ease: "easeOut" }
            }}
            dragTransition={{ bounceStiffness: 1000, bounceDamping: 100 }}
            layout
        >
            <div
                className={styles.itemHeader}
                onClick={onToggleExpand}
            >
                <div className={styles.itemHeaderLeft}>
                    <div
                        className={styles.dragHandle}
                        onPointerDown={(e) => controls.start(e)}
                        style={{ touchAction: 'none' }}
                        title="Drag to reorder"
                    >
                        <FaLayerGroup />
                    </div>
                    <span className={styles.itemIndex}>#{index + 1}</span>
                    <span className={styles.itemPreview}>{getItemPreview(item)}</span>
                </div>
                <div className={styles.itemHeaderRight}>
                    <div className={styles.itemReorder}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onMove(index, 'up'); }}
                            disabled={index === 0}
                            className={styles.headerReorderBtn}
                            title="Move Up"
                        >
                            <FaArrowUp />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onMove(index, 'down'); }}
                            disabled={index === totalItems - 1}
                            className={styles.headerReorderBtn}
                            title="Move Down"
                        >
                            <FaArrowDown />
                        </button>
                    </div>
                    {(selectedSectionName === 'Papers' || selectedSectionName === 'Published Papers') && (
                        <div className={styles.uploadArea}>
                            <input
                                type="file"
                                id={`file-${index}`}
                                style={{ display: 'none' }}
                                onChange={(e) => onUpload(index, e.target.files[0])}
                                accept=".pdf"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <label htmlFor={`file-${index}`} className={styles.uploadBtn} onClick={(e) => e.stopPropagation()}>
                                {isUploading === index ? <FaSpinner className={styles.spin} /> : <FaCloudUploadAlt />}
                                {item.pdfUrl ? 'Update PDF' : 'Upload PDF'}
                            </label>
                            {item.pdfUrl && (
                                <a
                                    href={`http://localhost:5000${item.pdfUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.viewPdfLink}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View PDF
                                </a>
                            )}
                        </div>
                    )}
                    <button
                        className={styles.deleteBtn}
                        onClick={(e) => { e.stopPropagation(); onDelete(index); }}
                        title="Delete Item"
                    >
                        <FaTrash />
                    </button>
                    <button className={styles.expandBtn}>
                        {expanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className={styles.itemContent}>
                            {renderEditor(item, index)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Reorder.Item>
    );
};

export default React.memo(CVItem);
