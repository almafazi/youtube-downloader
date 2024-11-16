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

export const isTikTokUrl = (url: string): boolean => {
  const tiktokRegex = /^.*https:\/\/(?:m|www|vm|vt)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video|photo)\/|\?shareId=|\&item_id=)(\d+))|\w+)/;
  return tiktokRegex.test(url);
};

/**
 * Check if the page is running on localhost (dev environment).
 */
export const isLocalHost = window.location.hostname === 'localhost';

/**
 * Get the current host.
 */
export const host = isLocalHost
  ? 'http://localhost:9001/'
  : `https://yt.y2mate.one/`;

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
