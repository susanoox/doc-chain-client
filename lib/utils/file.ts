/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
   return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Get file name without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
   return filename.replace(/\.[^/.]+$/, "");
}

/**
 * Get file type category
 */
export function getFileTypeCategory(mimeType: string): string {
   if (mimeType.startsWith("image/")) return "image";
   if (mimeType.startsWith("video/")) return "video";
   if (mimeType.startsWith("audio/")) return "audio";
   if (mimeType.includes("pdf")) return "pdf";
   if (mimeType.includes("word") || mimeType.includes("document"))
      return "document";
   if (mimeType.includes("sheet") || mimeType.includes("excel"))
      return "spreadsheet";
   if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
      return "presentation";
   if (mimeType.startsWith("text/")) return "text";
   return "file";
}

/**
 * Get file icon name based on type
 */
export function getFileIcon(mimeType: string): string {
   const category = getFileTypeCategory(mimeType);

   const icons: Record<string, string> = {
      image: "image",
      video: "video",
      audio: "music",
      pdf: "file-pdf",
      document: "file-text",
      spreadsheet: "file-spreadsheet",
      presentation: "file-presentation",
      text: "file-text",
      file: "file",
   };

   return icons[category] || "file";
}

/**
 * Download file from URL
 */
export function downloadFile(url: string, filename: string): void {
   const link = document.createElement("a");
   link.href = url;
   link.download = filename;
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
   });
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
   try {
      await navigator.clipboard.writeText(text);
      return true;
   } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
         document.execCommand("copy");
         document.body.removeChild(textArea);
         return true;
      } catch {
         document.body.removeChild(textArea);
         return false;
      }
   }
}
