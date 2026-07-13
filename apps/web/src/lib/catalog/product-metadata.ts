export function formatProductMetadata(...values: Array<string | undefined>): string {
  return values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)).join(' · ');
}
