// helper.jsx
import { useEffect, useState } from "react";

// Function to update cart situation based on the current image index
const updateCartSituation = (
  currentImageIndex,
  setCartSituation,
  folderImages
) => {
  setCartSituation(
    (currentImageIndex === 0 && "lo") ||
      (currentImageIndex === folderImages.length - 4 && "hi") ||
      "mid"
  );
};

export const useUpdateCartSituation = (
  currentImageIndex,
  setCartSituation,
  folderImages
) => {
  useEffect(() => {
    if (folderImages.length < 1) return;
    updateCartSituation(currentImageIndex, setCartSituation, folderImages);
  }, [currentImageIndex, folderImages, setCartSituation]);
};

// Function to calculate minimum width
export const calculateMinWidth = () => {
  return [(300 * 120) / 200 - 30, (300 * 120) / 200];
};

// Function to calculate maximum width
export const calculateMaxWidth = () => {
  return -(((300 * 120) / 200) * 4 - 120) / 4;
};
