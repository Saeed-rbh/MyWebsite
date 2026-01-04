// Re-export actions from slices for backward compatibility
export {
  updateVisibility,
  updateMenu,
  updateCurrentPage,
} from "../features/ui/uiSlice";

export {
  updateData,
  updateHomeData,
  updateStages,
  updateToggle,
  updateHover,
  updateAcademicElementSize,
} from "../features/data/dataSlice";
