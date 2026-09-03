export type CsvRow = Record<string, unknown>;

export type CsvDownloadOptions = {
  filename?: string;
  data: CsvRow[];
  columns?: string[];
  chunkSize?: number;
};

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";

  let stringValue =
    value instanceof Date
      ? value.toISOString()
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);

  stringValue = stringValue.replace(/"/g, '""');

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue}"`;
  }

  return stringValue;
}

export function downloadCsv({
  data,
  filename = "export.csv",
  columns,
  chunkSize = 5,
}: CsvDownloadOptions): void {
  if (!data.length) return;

  const headers = columns ?? Object.keys(data[0]);
  const chunks: BlobPart[] = [];

  chunks.push(headers.map(escapeCsvValue).join(",") + "\r\n");

  for (let i = 0; i < data.length; i += chunkSize) {
    const end = Math.min(i + chunkSize, data.length);

    // console.log(
    //   `CSV chunk: ${Math.floor(i / chunkSize) + 1} | rows ${i} - ${end - 1}`,
    // );

    const chunk = data
      .slice(i, end)
      .map((row) =>
        headers.map((column) => escapeCsvValue(row[column])).join(","),
      )
      .join("\r\n");

    chunks.push(chunk + "\r\n");
  }

  const blob = new Blob(chunks, {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
