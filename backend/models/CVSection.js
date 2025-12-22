const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const CVSection = sequelize.define('CVSection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false // We use custom IDs 0-8
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    background: {
        type: DataTypes.STRING,
        defaultValue: "rgb(0 0 0 / 30%)"
    },
    size: {
        type: DataTypes.JSON, // Use JSON for arrays [width, height]
        allowNull: false
    },
    top: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    adjustTop: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    adjustViewport: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    adjustHeight: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    fixed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isCalc: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    explanation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    list: {
        type: DataTypes.JSON, // Store list items as JSON
        defaultValue: []
    }
});

module.exports = CVSection;
