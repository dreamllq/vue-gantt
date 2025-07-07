function getKeyByEnumValue<T>(myEnum: T, value: any): string | undefined {
  for (const key in myEnum) {
    if (Number(myEnum[key as keyof typeof myEnum]) === value) {
      return key;
    }
  }
  return undefined;
}