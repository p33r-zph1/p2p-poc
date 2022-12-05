function isObject(tag: number) {
  return (tag >= 2 && tag <= 51) || (tag >= 80 && tag <= 99) || tag === 62;
}

export function parseQrData(qrData: Record<string, any>, subValue = false) {
  const tags: Record<string, any> = {};
  let i = 0;

  while (i < qrData.length) {
    const tag = qrData.substring(i, i + 2);
    i += 2;

    const valueLength = Number(qrData.substring(i, i + 2));
    i += 2;

    let value = qrData.substring(i, i + valueLength);
    i += valueLength;

    if (isObject(Number(tag)) && !subValue) value = parseQrData(value, true);

    tags[tag] = value;
  }

  return tags;
}
