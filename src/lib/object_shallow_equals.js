function objectShallowEquals(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return false;

  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;

  return ka.every((ki) => a[ki] === b[ki]);
}

export default objectShallowEquals;
