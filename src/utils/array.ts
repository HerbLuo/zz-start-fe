/** 1层的浅比较 */
export function areEqual(arr1: any[] | undefined, arr2: any[] | undefined) {
  if (!arr1) {
    if (!arr2) {
      return true;
    } else {
      return false;
    }
  }
  if (!arr2) {
    if (!arr1) {
      return true;
    } else {
      return false;
    }
  }

  const arr1length = arr1.length;
  if (arr1length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}
