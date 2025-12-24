import { useSpring } from "react-spring";
import { LAYOUT } from "./LayoutConstants";

export const useBentoLayout = ({
    isActive,
    stages,
    column = 0, // Default to left column if undefined
    size, // [height, width]
    elementSize, // Container width
    name, // Kept for legacy special cases if absolutely needed
    top, // Added top parameter
    height, // Added height parameter
}) => {
    // Legacy fallback: Force Teaching/Awards to Column 1 if data is missing
    const effectiveColumn = (name === "Teaching" || name === "Awards") ? 1 : column;
    const isRightColumn = effectiveColumn == 1; // Relaxed check

    // Helper: Calculate constants for Desktop Layout
    const GAP = 10;
    const RIGHT_MARGIN = 10;

    const getDesktopBaseLeft = () => {
        if (isRightColumn) {
            return size[1] + GAP; // Left Column Width + 10px Gap
        }
        return 0;
    };

    const getDesktopBaseWidth = () => {
        if (isRightColumn) {
            // Fill remaining space: Container - LeftPosition - RightMargin
            // Assuming 0px Right Margin to maximize width
            return elementSize - (size[1] + GAP) - RIGHT_MARGIN;
        }
        // Left Column or Default
        return size[1];
    };

    // Calculate Width
    const calculateWidth = () => {
        // Mobile view (stages[1]): Full width minus tiny margin
        if (stages[1]) {
            // Special case for Teaching/Awards in mobile view (legacy logic preserved)
            if (!isActive && (name === "Teaching" || name === "Awards")) {
                return Math.min(elementSize * LAYOUT.MOBILE_WIDTH_FACTOR, size[1]) / 2 - 5;
            }
            return Math.min(elementSize * LAYOUT.MOBILE_WIDTH_FACTOR, size[1]);
        }

        // Desktop view:
        // If "Skills" (legacy special case) -> full width specified in JSON
        if (name === "Skills") return size[1];

        const desktopWidth = getDesktopBaseWidth();

        // Split items (Teaching/Awards) when not active
        if (!isActive && (name === "Teaching" || name === "Awards")) {
            return desktopWidth / 2 - 5;
        }

        // Default desktop width calculation
        return desktopWidth;
    };

    // Calculate Left Position
    const calculateLeft = () => {
        // Mobile view
        if (stages[1]) {
            // Centered calculation
            const centeredLeft = (elementSize - Math.min(elementSize * LAYOUT.MOBILE_WIDTH_FACTOR, size[1])) / 2;

            // Special split case for Awards on mobile
            if (name === "Awards" && !isActive) {
                return centeredLeft + Math.min(elementSize * LAYOUT.MOBILE_WIDTH_FACTOR, size[1]) / 2 + 5;
            }
            return centeredLeft;
        }

        // Desktop view

        // Column 0 (Left)
        if (!isRightColumn) return 0;

        // Column 1 (Right)
        if (isRightColumn) {
            const baseLeft = getDesktopBaseLeft();

            // Special split case for Awards on desktop
            if (name === "Awards" && !isActive) {
                const desktopWidth = getDesktopBaseWidth();
                // BaseLeft + HalfWidth + Gap (split gap is typically 10px implicitly if each is half - 5)
                // Note: Logic below: baseLeft + (Width / 2) + 5
                // Gap = (baseLeft + W/2 + 5) - (baseLeft + W/2 - 5) = 10px.
                // Consistent with Main Gap.
                return baseLeft + (desktopWidth / 2) + 5;
            }
            return baseLeft;
        }

        return 0; // Fallback
    };

    // React Spring definition
    const styleLayout = useSpring({
        width: calculateWidth(),
        left: calculateLeft(),
        top: typeof top === 'number' ? `${top}px` : top, // Ensure proper formatting
        height: typeof height === 'number' ? `${height}px` : height,
        // Border Radius logic
        borderRadius: isActive
            ? LAYOUT.BORDER_RADIUS_ACTIVE
            : Math.max(Math.ceil(size[0] / 4.75), LAYOUT.BORDER_RADIUS_DEFAULT),
        // Background color (if dynamic needs) - handled by parent usually
    });

    return styleLayout;
};
