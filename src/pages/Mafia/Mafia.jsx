import React, { useState } from "react";
import "./Mafia.css";
// Absolute import or relative depending on config, usually relative in create-react-app
import mafiaLogo from "../../assets/mafia_logo.jpg";

const Mafia = () => {
    const [gameState, setGameState] = useState("setup"); // setup, playing, dashboard

    // Specific roles configuration
    const [rolesConfig, setRolesConfig] = useState({
        // Mafia Team
        godfather: 1,
        drLecter: 0,
        simpleMafia: 0,
        // Town Team
        doctor: 0,
        detective: 0,
        sniper: 0,
        dieHard: 0,
        civilian: 1,
    });

    const [players, setPlayers] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [isRoleRevealed, setIsRoleRevealed] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false); // For card animation

    // Role Definitions
    const ROLE_DEFINITIONS = {
        godfather: {
            name: "Godfather",
            label: "پدرخوانده",
            team: "mafia",
            desc: "Leader of the Mafia. Appears as Citizen to Detective.",
            unique: true
        },
        drLecter: {
            name: "Dr. Lecter",
            label: "دکتر لکتر",
            team: "mafia",
            desc: "Mafia Doctor. Can save one Mafia member from being shot.",
            unique: true
        },
        simpleMafia: {
            name: "Simple Mafia",
            label: "مافیای ساده",
            team: "mafia",
            desc: "Standard Mafia member. Wake up and kill together.",
            unique: false
        },
        doctor: {
            name: "Doctor",
            label: "دکتر",
            team: "town",
            desc: "Saves one person from being killed each night.",
            unique: true
        },
        detective: {
            name: "Detective",
            label: "کارآگاه",
            team: "town",
            desc: "Asks God about a player's identity (Mafia or Citizen).",
            unique: true
        },
        sniper: {
            name: "Sniper",
            label: "اسنایپر",
            team: "town",
            desc: "Has limited bullets to shoot a suspect at night.",
            unique: true
        },
        dieHard: {
            name: "Die-Hard",
            label: "جان سخت",
            team: "town",
            desc: "Does not die from the first Mafia attack. Can inquire about eliminated roles.",
            unique: true
        },
        civilian: {
            name: "Civilian",
            label: "شهروند ساده",
            team: "town",
            desc: "No special abilities. Find the Mafia during the day.",
            unique: false
        },
    };

    const getTotalPlayers = () => {
        return Object.values(rolesConfig).reduce((a, b) => a + b, 0);
    };

    const updateRoleConfig = (role, change) => {
        setRolesConfig((prev) => {
            const newValue = prev[role] + change;
            const isUnique = ROLE_DEFINITIONS[role].unique;
            if (newValue < 0) return prev;
            if (isUnique && newValue > 1) return prev;
            return { ...prev, [role]: newValue };
        });
    };

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const startGame = () => {
        let roles = [];
        Object.keys(rolesConfig).forEach(key => {
            for (let i = 0; i < rolesConfig[key]; i++) {
                roles.push(ROLE_DEFINITIONS[key]);
            }
        });

        roles = shuffleArray(roles);

        const newPlayers = roles.map((roleDef, index) => ({
            id: index + 1,
            role: roleDef.name,
            label: roleDef.label,
            team: roleDef.team,
            description: roleDef.desc,
            isDead: false,
            isEliminated: false,
        }));

        setPlayers(newPlayers);
        setCurrentPlayerIndex(0);
        setGameState("playing");
        setIsRoleRevealed(false);
        setIsFlipped(false);
    };

    const nextPlayer = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setIsRoleRevealed(false);
            if (currentPlayerIndex + 1 >= players.length) {
                setGameState("dashboard");
            } else {
                setCurrentPlayerIndex((prev) => prev + 1);
            }
        }, 300); // Wait for flip back
    };

    const handleReveal = () => {
        setIsRoleRevealed(true);
        setTimeout(() => setIsFlipped(true), 50);
    };

    const resetGame = () => {
        setGameState("setup");
        setPlayers([]);
        setCurrentPlayerIndex(0);
    };

    // togglePlayerStatus removed as it's no longer needed for the new flow

    // --- RENDERERS ---

    const renderCounter = (key, label) => {
        const isUnique = ROLE_DEFINITIONS[key].unique;
        return (
            <div key={key} className="config-item">
                <label>{label}</label>
                <div className="counter-control small">
                    <button onClick={() => updateRoleConfig(key, -1)}>-</button>
                    <span className={rolesConfig[key] > 0 ? "active-count" : null}>
                        {rolesConfig[key]}
                    </span>
                    <button
                        onClick={() => updateRoleConfig(key, 1)}
                        disabled={isUnique && rolesConfig[key] >= 1}
                        className={isUnique && rolesConfig[key] >= 1 ? "disabled" : ""}
                    >
                        +
                    </button>
                </div>
            </div>
        );
    };

    const renderSetup = () => (
        <div className="mafia-container setup-mode fade-in">
            <div className="setup-top-section">
                <div className="logo-container">
                    <img src={mafiaLogo} alt="Mafia" className="mafia-logo" />
                </div>

                <div className="setup-header">
                    <h1>GAME SETUP</h1>
                    <div className="total-players-badge">
                        <span className="label">PLAYERS</span>
                        <span className="value">{getTotalPlayers()}</span>
                    </div>
                </div>
            </div>

            <div className="roles-grid">
                <div className="role-group mafia-group">
                    <div className="group-header">MAFIA TEAM</div>
                    {renderCounter('godfather', 'Godfather')}
                    {renderCounter('drLecter', 'Dr. Lecter')}
                    {renderCounter('simpleMafia', 'Simple Mafia')}
                </div>

                <div className="role-group town-group">
                    <div className="group-header">TOWN TEAM</div>
                    {renderCounter('doctor', 'Doctor')}
                    {renderCounter('detective', 'Detective')}
                    {renderCounter('sniper', 'Sniper')}
                    {renderCounter('dieHard', 'Die-Hard')}
                    {renderCounter('civilian', 'Simple Citizen')}
                </div>
            </div>

            <div className="action-area">
                <button
                    className="start-button"
                    onClick={startGame}
                    disabled={getTotalPlayers() < 3}
                >
                    START GAME
                </button>
            </div>
        </div>
    );

    const renderPassToPlayer = () => (
        <div className="mafia-container play-mode fade-in">
            <div className="card-perspective">
                <div className={`game-card ${isFlipped ? 'flipped' : ''}`}>
                    <div className="card-front">
                        <div className="card-logo-sm">
                            <img src={mafiaLogo} alt="Mafia" />
                        </div>
                        <h2>PLAYER {currentPlayerIndex + 1}</h2>
                        <p className="instruction">Pass the device to this player.</p>
                        <p className="sub-instruction">Tap the card to reveal your identity.</p>
                        <button className="reveal-trigger" onClick={handleReveal}>
                            REVEAL IDENTITY
                        </button>
                    </div>
                    <div className="card-back">
                        {/* Back content rendered dynamically but logic handled below */}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRoleReveal = () => {
        const currentPlayer = players[currentPlayerIndex];
        return (
            <div className="mafia-container play-mode">
                <div className="card-perspective">
                    <div className={`game-card ${isFlipped ? 'flipped' : ''}`}>
                        <div className="card-front">
                            {/* Placeholder for animation continuity */}
                        </div>
                        <div className={`card-back team-${currentPlayer.team}`}>
                            <div className="role-header">
                                <span className="player-num">#{currentPlayer.id}</span>
                                <span className="team-badge">{currentPlayer.team.toUpperCase()}</span>
                            </div>
                            <div className="role-content">
                                <h1 className="role-title">{currentPlayer.role}</h1>
                                <h2 className="role-label">{currentPlayer.label}</h2>
                                <p className="role-description">{currentPlayer.description}</p>
                            </div>
                            <button className="confirm-button" onClick={nextPlayer}>
                                UNDERSTOOD
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderStatistics = () => {
        const mafiaCount = players.filter(p => p.team === 'mafia').length;
        const townCount = players.filter(p => p.team === 'town').length;

        return (
            <div className="mafia-container statistics-mode fade-in">
                <div className="stats-header">
                    <img src={mafiaLogo} alt="Mafia" className="stats-logo" />
                    <div className="stats-title-group">
                        <h2>GAME READY</h2>
                        <p>Roles Assigned Successfully</p>
                    </div>
                </div>

                <div className="stats-content">
                    <div className="stat-card total-card">
                        <span className="sc-label">TOTAL PLAYERS</span>
                        <span className="sc-value">{players.length}</span>
                    </div>

                    <div className="stat-row">
                        <div className="stat-card team-mafia">
                            <span className="sc-value">{mafiaCount}</span>
                            <span className="sc-label">MAFIA</span>
                        </div>
                        <div className="stat-card team-town">
                            <span className="sc-value">{townCount}</span>
                            <span className="sc-label">TOWN</span>
                        </div>
                    </div>

                    <div className="enjoy-message">
                        <p>
                            All identities are hidden.<br />
                            The City is now in your hands.
                        </p>
                        <h3>HAVE FUN!</h3>
                    </div>
                </div>

                <div className="action-area">
                    <button className="start-button new-game-btn" onClick={resetGame}>
                        START NEW GAME
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="mafia-wrapper">
            {gameState === "setup" && renderSetup()}
            {gameState === "playing" && !isRoleRevealed && renderPassToPlayer()}
            {gameState === "playing" && isRoleRevealed && renderRoleReveal()}
            {gameState === "dashboard" && renderStatistics()}
        </div>
    );
};

export default Mafia;
