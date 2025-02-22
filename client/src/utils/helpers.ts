/**
 * Check if the url is a valid YouTube-URL.
 * @param url youtube url
 * @returns if it's a YouTube-URL or not
 */
export const isYtUrl = (url: string) => {
  const ytRegex = new RegExp(
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\\-]+\?v=|embed\/|v\/)?)([\w\\-]+)(\S+)?$/g
  );
  return ytRegex.test(url);
};

export const isTikTokUrl = (url: string) => {
  return true;
};

/**
 * Check if the page is running on localhost (dev environment).
 */
export const isLocalHost = window.location.hostname === 'localhost';

export const formatDownloadLabel = (format: string) => {
  if (format.startsWith('MP3')) {
    // Extract the bitrate from format (e.g., 'MP3-320')
    const bitrate = format.split('-')[1];
    return `MP3 - ${bitrate} Kbps`; // Format for MP3 with bitrate
  } else if (format.startsWith('MP4')) {
    // Extract the quality from format (e.g., 'MP4-720')
    const quality = format.split('-')[1];
    return `MP4 - ${quality}p`; // Format for MP4 with resolution
  }
  return format; // Default fallback in case it's not MP3 or MP4
};

/**
 * Get the current host.
 */
export const host = isLocalHost
  ? 'http://localhost:3017/'
  : `https://yt-dlp.y2mate.one/`;

/**
 * Get download-url from YouTube-Video.
 * @param videoId YouTube-Video-ID
 * @param format Format, e.g. mp4, mp3
 * @returns
 */
export const getDownloadUrl = (videoId: string, format = 'mp4') =>
  `${host}/watch?v=${videoId}&format=${format}`;

/**
 * Available formats to download.
 */
export const formats = [
  { text: 'MP4', format: '.mp4' },
  { text: 'MP3', format: '.mp3' },
  { text: 'MOV', format: '.mov' },
  { text: 'FLV', format: '.flv' },
];

/**
 * Decode a string because sometimes it's with encoded HTML-Entities, e.g. Klaas&#39; ECHTE Mama als Überraschungsgast im Studio! | Late Night Berlin'.
 * Thanks to https://linuxhint.com/decode-html-entities-javascript/
 * @param value Random string, e.g. YouTube-Video-Title
 * @returns decoded string
 */
export const decodeStr = (value: string) => {
  const txt = new DOMParser().parseFromString(value, 'text/html');
  return txt.documentElement.textContent;
};


export const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};
/**
 *
 * @param seconds Seconds to format into minutes and seconds
 * @returns formatted number
 */
export const formatSecondsToMinutesAndSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${formattedMinutes}:${formattedSeconds}`;
};
