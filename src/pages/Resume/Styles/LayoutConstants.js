export const LAYOUT = {
    COLUMN_GAP: 15,
    ROW_GAP: 30, // Implicit space often handled by top/height diffs, but useful to have
    MOBILE_BREAKPOINT_WIDTH: 10, // from elementSize.width > 10 check
    EXTRA_SPACE: 30,
    BORDER_RADIUS_DEFAULT: 35,
    BORDER_RADIUS_ACTIVE: 40,
    HERO_EXPAND_PADDING: 20, // Padding when expanded

    // Magic numbers extracted from InteractiveDiv logic
    MOBILE_WIDTH_FACTOR: 0.97, // Math.min(elementSize * 0.97, ...)
    DESKTOP_WIDTH_SCALE: 1.5,  // size[1] * 1.5 logic

    // Specific offsets
    OFFSET_TOP_MOBILE: -60,
    OFFSET_LEFT_STACKED: 5,
};
