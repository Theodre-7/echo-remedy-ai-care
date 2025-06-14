
import { useRef } from "react";
import { pipeline } from "@huggingface/transformers";

// Custom hook for browser-side image classification using Huggingface transformers.js
export const useHuggingfaceImageClassifier = () => {
  const classifierRef = useRef<any>(null);

  // Load classifier/model if not loaded
  const loadModel = async () => {
    if (!classifierRef.current) {
      classifierRef.current = await pipeline(
        "image-classification",
        // Use the specialized dermatology model
        "ashraq/dermatology-image-classification",
        { device: "webgpu" }
      );
    }
    return classifierRef.current;
  };

  // Classify an image given a File (image upload)
  const classify = async (file: File): Promise<{ label: string; score: number }[]> => {
    await loadModel();

    // Pass the file's object URL directly to the pipeline (works with Huggingface transformers.js)
    const url = URL.createObjectURL(file);

    // Run prediction (use string url directly)
    const results = await classifierRef.current(url);

    // Free up the object URL
    URL.revokeObjectURL(url);

    // results: [{ label: "...", score: ... }, ...]
    return results;
  };

  return { classify };
};
