import {
  ACADEMIC_HOVER,
  ACADEMIC_TOGGLE,
  STAGES,
  DATA,
  SCROLLABLE_REF,
  VISIBILITY,
  MENU,
  ACADEMIC_ELEMENT_SIZE,
} from "../constants/actionTypes";

export const updateData = (data) => ({
  type: DATA,
  payload: data,
});

export const updateStages = (stages) => ({
  type: STAGES,
  payload: stages,
});

export const updateToggle = (toggle) => ({
  type: ACADEMIC_TOGGLE,
  payload: toggle,
});

export const updateHover = (hover) => ({
  type: ACADEMIC_HOVER,
  payload: hover,
});

export const updateScrollableRef = (ref) => ({
  type: SCROLLABLE_REF,
  payload: ref,
});

export const updateVisibility = (ref) => ({
  type: VISIBILITY,
  payload: ref,
});

export const updateMenu = (ref) => ({
  type: MENU,
  payload: ref,
});

export const updateAcademicElementSize = (ref) => ({
  type: ACADEMIC_ELEMENT_SIZE,
  payload: ref,
});
