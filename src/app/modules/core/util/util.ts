
export const getHandleFromUrl = (url: string): string => {
    try {
      // Remove any trailing slash from the URL
      const sanitizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      // Split the URL by slashes and get the last segment
      const segments = sanitizedUrl.split('/');
      return segments[segments.length - 1];
    } catch (error) {
      console.error('Error processing the URL:', error);
      return '';
    }
}
