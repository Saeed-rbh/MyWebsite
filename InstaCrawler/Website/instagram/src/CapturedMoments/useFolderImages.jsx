import { useEffect, useState } from "react";

const useFolderImages = () => {
  const [allFolderImages, setAllFolderImages] = useState([]);

  const LoadImages = () => {
    // Import images from "./Instagram" directory
    const imageContext = require.context(
      "./Instagram",
      true,
      /\.(jpg|jpeg|png)$/
    );

    // Reduce the imported images into organized folder structures
    const allImages = imageContext.keys().reduce((acc, item) => {
      const [, folderName] = item.split("/");
      let folderObj = acc.find((obj) => obj.folderName === folderName);

      // If the folder doesn't exist, create it
      if (!folderObj) {
        folderObj = {
          id: acc.length,
          folderName,
          Images: [],
        };
        acc.push(folderObj);
      }

      // Add image to the folder
      folderObj.Images.push(imageContext(item));
      return acc;
    }, []);

    // Update state with the organized images
    setAllFolderImages(allImages);
  };

  useEffect(() => {
    LoadImages();
  }, []);

  return allFolderImages;
};

export default useFolderImages;
