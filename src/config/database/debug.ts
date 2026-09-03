function formatSql(sql: string, values: unknown[] | null): string {
  if (!values || values.length === 0) return sql;

  let i = 0;

  return sql.replace(/\?/g, () => {
    const value = values[i++];

    if (value === null || value === undefined) return "NULL";
    if (value instanceof Date) return `'${value.toISOString()}'`;
    if (typeof value === "string") return `'${value}'`;

    return String(value);
  });
}

export function logQuery(
  sql: string,
  values: unknown[] | null,
  database: string,
): void {
  const formatted = formatSql(sql.trim(), values);

  console.log(
    `\n[DB] ${database} | ${new Date().toISOString()}\n${formatted}\n`,
  );
}
