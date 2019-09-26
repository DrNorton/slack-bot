export function isURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(str);
}

function combineStyles(...styles) {
  return function CombineStyles(theme) {
    const outStyles = styles.map((arg) => {
      // Apply the "theme" object for style functions.
      if (typeof arg === 'function') {
        return arg(theme);
      }
      // Objects need no change.
      return arg;
    });

    return outStyles.reduce((acc, val) => Object.assign(acc, val));
  };
}

export default combineStyles;

export function devideArrayThroughOne<T>(
  array: Array<T>
): [Array<T>, Array<T>] {
  const array1: Array<T> = [];
  const array2: Array<T> = [];
  for (let i = 0; i < array.length; i++) {
    if (i % 2 === 0) {
      array1.push(array[i]);
    } else {
      array2.push(array[i]);
    }
  }

  return [array1, array2];
}


