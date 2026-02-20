import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';

// Professional Academic CV Styles
const styles = StyleSheet.create({
    page: {
        padding: 50,
        paddingTop: 40,
        paddingBottom: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
        color: '#1a1a1a',
    },
    // Header Section
    header: {
        marginBottom: 25,
        textAlign: 'center',
    },
    name: {
        fontSize: 22,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1.5,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        fontSize: 9,
        color: '#444',
    },
    contactItem: {
        flexDirection: 'row',
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginTop: 10,
    },
    // Section Styles
    section: {
        marginBottom: 18,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#222',
    },
    sectionLine: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderBottomColor: '#888',
        marginLeft: 10,
    },
    // Education / Experience Items
    entryContainer: {
        marginBottom: 10,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    entryTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
    },
    entryDate: {
        fontSize: 9,
        color: '#555',
    },
    entrySubtitle: {
        fontSize: 9,
        fontFamily: 'Helvetica-Oblique',
        color: '#444',
        marginBottom: 2,
    },
    entryDetail: {
        fontSize: 9,
        color: '#333',
        marginLeft: 10,
        marginTop: 2,
    },
    // Publications
    publication: {
        marginBottom: 6,
        paddingLeft: 12,
    },
    publicationText: {
        fontSize: 9,
        color: '#333',
        textAlign: 'justify',
    },
    pubAuthors: {
        fontFamily: 'Helvetica',
    },
    pubTitle: {
        fontFamily: 'Helvetica-Oblique',
    },
    pubJournal: {
        fontFamily: 'Helvetica',
    },
    // Skills
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    skillRow: {
        flexDirection: 'row',
        marginBottom: 4,
        width: '100%',
    },
    skillCategory: {
        width: 85,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#333',
    },
    skillList: {
        flex: 1,
        fontSize: 9,
        color: '#444',
    },
    // Bullet Items
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 10,
    },
    bullet: {
        width: 12,
        fontSize: 9,
    },
    bulletText: {
        flex: 1,
        fontSize: 9,
        color: '#333',
    },
    // Research Interests (inline)
    interestsText: {
        fontSize: 10,
        color: '#333',
        textAlign: 'center',
    },
});

// Section Header Component
const SectionHeader = ({ title }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionLine} />
    </View>
);

const ResumePDF = ({ cvData }) => {
    if (!cvData) return null;

    const getSection = (name) => cvData.find(s => s.name === name);

    const personalInfo = getSection('PersonalInfo')?.list[0] || {};
    const education = getSection('Qualifications')?.list || [];
    const researchInterests = getSection('ResearchInterests')?.list || [];
    const skills = getSection('Skills')?.list || [];
    const papers = getSection('Published Papers')?.list || [];
    const conferences = getSection('Conference')?.list || [];
    const teaching = getSection('Teaching')?.list || [];
    const awards = getSection('Awards')?.list || [];

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personalInfo.name || "Saeed Arabha"}</Text>
                    <View style={styles.contactRow}>
                        {personalInfo.caPhone && <Text>{personalInfo.caPhone}</Text>}
                        {personalInfo.email && <Text>{personalInfo.email}</Text>}
                    </View>
                    <View style={styles.contactRow}>
                        {personalInfo.linkedin && <Text>{personalInfo.linkedin}</Text>}
                        {personalInfo.scholar && <Text>{personalInfo.scholar}</Text>}
                    </View>
                    <View style={styles.divider} />
                </View>

                {/* Research Interests */}
                {researchInterests.length > 0 && (
                    <View style={styles.section}>
                        <SectionHeader title="Research Interests" />
                        <Text style={styles.interestsText}>
                            {researchInterests.map(i => i.label).join('  |  ')}
                        </Text>
                    </View>
                )}

                {/* Education */}
                <View style={styles.section}>
                    <SectionHeader title="Education" />
                    {education.map((edu, index) => (
                        <View key={index} style={styles.entryContainer}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>{edu.title}</Text>
                                <Text style={styles.entryDate}>{edu.Date}</Text>
                            </View>
                            <Text style={styles.entrySubtitle}>{edu.Location}</Text>
                            {edu.Thesis && (
                                <Text style={styles.entryDetail}>
                                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>Thesis: </Text>
                                    {edu.Thesis}
                                </Text>
                            )}
                            {edu.Supervisor && (
                                <Text style={styles.entryDetail}>
                                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>Supervisor: </Text>
                                    {edu.Supervisor}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* Publications */}
                {papers.length > 0 && (
                    <View style={styles.section}>
                        <SectionHeader title="Publications" />
                        {papers.map((paper, index) => (
                            <View key={index} style={styles.publication}>
                                <Text style={styles.publicationText}>
                                    <Text style={styles.pubAuthors}>
                                        {`${index + 1}. `}
                                        {(paper.AuthorsList || paper.Authors.split(', ')).map((author, i, arr) => (
                                            <Text key={i} style={author.includes('S Arabha') || author.includes('S. Arabha') ? { fontFamily: 'Helvetica-Bold' } : {}}>
                                                {author}{i < arr.length - 1 ? ', ' : ''}
                                            </Text>
                                        ))}
                                    </Text>
                                    {'. '}
                                    <Text style={styles.pubTitle}>"{paper.Title}"</Text>
                                    {', '}
                                    <Text style={styles.pubJournal}>{paper.Journal}</Text>
                                    {paper.Year && `, ${paper.Year}`}.
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <View style={styles.section}>
                        <SectionHeader title="Technical Skills" />
                        {skills.map((cat, index) => (
                            <View key={index} style={styles.skillRow}>
                                <Text style={styles.skillCategory}>{cat.Title}:</Text>
                                <Text style={styles.skillList}>
                                    {cat.skill ? cat.skill.map(s => s[0]).join(', ') : ''}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Honors & Awards */}
                {awards.length > 0 && (
                    <View style={styles.section}>
                        <SectionHeader title="Honors & Awards" />
                        {awards.map((award, index) => (
                            <View key={index} style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>{award.Award}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Teaching & Experience */}
                {teaching.length > 0 && (
                    <View style={styles.section}>
                        <SectionHeader title="Teaching & Experience" />
                        {teaching.map((exp, index) => (
                            <View key={index} style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>{exp.Teaching}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {conferences.length > 0 && (
                    <View style={styles.section}>
                        <SectionHeader title="Conferences" />
                        {conferences.map((conf, index) => (
                            <View key={index} style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>
                                    {conf.Type ? `${conf.Type}: "${conf.Title}" at ${conf.Location}, ${conf.Year}.` : (conf.Conference || conf.Explanation)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

            </Page>
        </Document>
    );
};

export default ResumePDF;
