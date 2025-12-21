// Re-export actions from slices for backward compatibility
export {
  updateVisibility,
  updateMenu,
  updateCurrentPage,
} from "../features/ui/uiSlice";

export {
  updateData,
  updateStages,
  updateToggle,
  updateHover,
  updateScrollableRef,
  updateAcademicElementSize,
} from "../features/data/dataSlice";
