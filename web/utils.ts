//
export const hashString = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const niceBytes = (x: number) => {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let l = 0;
  let n = parseInt(x as any, 10) || 0;
  // eslint-disable-next-line no-plusplus
  while (n >= 1024 && ++l) {
    n /= 1024;
  }
  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
};

export const calculateTotalBytes = (sizes: string[] = []) => {
  const unitMultipliers = {
    BYTES: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
    PB: 1024 * 1024 * 1024 * 1024 * 1024,
    EB: 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  };

  return (
    sizes?.reduce((total, item) => {
      let sizeString;
      if (item) sizeString = item;
      else sizeString = "";

      const sizeValue = parseFloat(sizeString);
      const unit = sizeString?.match(/[a-zA-Z]+/)[0].toUpperCase();
      const sizeInBytes = sizeValue * (unitMultipliers[unit] || 1);
      return total + sizeInBytes;
    }, 0) ?? 0
  );
};
