// Copied from https://github.com/sindresorhus/p-map-series
// MIT Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
export async function mapSeriesAsync<ValueT, MappedT>(
  iterable: Iterable<PromiseLike<ValueT> | ValueT>,
  cb: (item: ValueT, idx: number) => PromiseLike<MappedT> | MappedT
): Promise<MappedT[]> {
  const results: MappedT[] = [];
  let index = 0;
  for (const item of iterable) {
    const result = await cb(await item, index++);
    results.push(result);
  }
  return results;
}
