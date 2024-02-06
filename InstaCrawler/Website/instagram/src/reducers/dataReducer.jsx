import {
  ACADEMIC_HOVER,
  ACADEMIC_TOGGLE,
  STAGES,
  DATA,
  SCROLLABLE_REF,
  ACADEMIC_ELEMENT_SIZE,
} from "../constants/actionTypes";

const initialState = {
  academicData: [],
  stages: [],
  toggle: [false, undefined, false],
  hover: [false, undefined],
  scollableRef: null,
  academicElementSize: [0, 0],
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case DATA:
      return {
        ...state,
        academicData: action.payload,
      };
    case STAGES:
      return {
        ...state,
        stages: action.payload,
      };
    case ACADEMIC_TOGGLE:
      return {
        ...state,
        toggle: action.payload,
      };
    case ACADEMIC_HOVER:
      return {
        ...state,
        hover: action.payload,
      };
    case SCROLLABLE_REF:
      return {
        ...state,
        scollableRef: action.payload,
      };
    case ACADEMIC_ELEMENT_SIZE:
      return {
        ...state,
        academicElementSize: action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
