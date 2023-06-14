export const updateMenu = (isOpen) => {
  return {
    type: 'UPDATE_MENU',
    payload: isOpen,
  };
};