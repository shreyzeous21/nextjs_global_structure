import "server-only";

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { getMySqlPool } from "../pools";
import type { DatabaseKey } from "../types";
import { logQuery } from "../debug";

type Operator =
  | "="
  | "!="
  | "<>"
  | ">"
  | ">="
  | "<"
  | "<="
  | "LIKE"
  | "NOT LIKE"
  | "IS"
  | "IS NOT";

type OrderDirection = "ASC" | "DESC";

type QueryValue = string | number | boolean | Date | null;

type WhereCondition = {
  sql: string;
  values: QueryValue[];
};

function quoteIdentifier(identifier: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/.test(identifier)) {
    throw new Error(`Invalid SQL identifier: ${identifier}`);
  }

  return identifier
    .split(".")
    .map((part) => `\`${part}\``)
    .join(".");
}

export class QueryBuilder<T extends RowDataPacket = RowDataPacket> {
  private readonly table: string;

  private database: DatabaseKey;

  private selectedColumns: string[] = ["*"];

  private conditions: WhereCondition[] = [];

  private joins: string[] = [];

  private groupByColumns: string[] = [];

  private orderByColumns: string[] = [];

  private limitValue?: number;

  private offsetValue?: number;

  private debugEnabled = false;

  constructor(table: string, database: DatabaseKey = "primary") {
    this.table = table;
    this.database = database;
  }

  /**
   * Change database.
   */
  useDb(database: DatabaseKey): this {
    this.database = database;

    return this;
  }

  /**
   * Enable SQL debug logging for this query.
   *
   * db("users").debug().where("id", 1).get()
   */
  debug(): this {
    this.debugEnabled = true;

    return this;
  }

  /**
   * SELECT
   *
   * db("users").select("*")
   * db("users").select("id", "name", "email")
   */
  select(...columns: string[]): this {
    this.selectedColumns =
      columns.length > 0
        ? columns.map((column) => {
            if (column === "*") {
              return "*";
            }

            return quoteIdentifier(column);
          })
        : ["*"];

    return this;
  }

  /**
   * WHERE column = value
   *
   * .where("status", "ACTIVE")
   */
  where(column: string, value: QueryValue): this;

  /**
   * WHERE column operator value
   *
   * .where("age", ">=", 18)
   */
  where(column: string, operator: Operator, value: QueryValue): this;

  where(
    column: string,
    operatorOrValue: Operator | QueryValue,
    value?: QueryValue,
  ): this {
    if (value === undefined) {
      this.conditions.push({
        sql: `${quoteIdentifier(column)} = ?`,
        values: [operatorOrValue as QueryValue],
      });

      return this;
    }

    this.conditions.push({
      sql: `${quoteIdentifier(column)} ${operatorOrValue} ?`,
      values: [value],
    });

    return this;
  }

  /**
   * WHERE column IN (...)
   */
  whereIn(column: string, values: QueryValue[]): this {
    if (values.length === 0) {
      this.conditions.push({
        sql: "1 = 0",
        values: [],
      });

      return this;
    }

    const placeholders = values.map(() => "?").join(", ");

    this.conditions.push({
      sql: `${quoteIdentifier(column)} IN (${placeholders})`,
      values,
    });

    return this;
  }

  /**
   * WHERE column NOT IN (...)
   */
  whereNotIn(column: string, values: QueryValue[]): this {
    if (values.length === 0) {
      return this;
    }

    const placeholders = values.map(() => "?").join(", ");

    this.conditions.push({
      sql: `${quoteIdentifier(column)} NOT IN (${placeholders})`,
      values,
    });

    return this;
  }

  /**
   * WHERE column LIKE value
   */
  whereLike(column: string, value: string): this {
    this.conditions.push({
      sql: `${quoteIdentifier(column)} LIKE ?`,
      values: [value],
    });

    return this;
  }

  /**
   * WHERE column IS NULL
   */
  whereNull(column: string): this {
    this.conditions.push({
      sql: `${quoteIdentifier(column)} IS NULL`,
      values: [],
    });

    return this;
  }

  /**
   * WHERE column IS NOT NULL
   */
  whereNotNull(column: string): this {
    this.conditions.push({
      sql: `${quoteIdentifier(column)} IS NOT NULL`,
      values: [],
    });

    return this;
  }

  /**
   * Raw WHERE clause.
   *
   * Use this only when the normal builder isn't enough.
   */
  whereRaw(sql: string, values: QueryValue[] = []): this {
    this.conditions.push({
      sql,
      values,
    });

    return this;
  }

  /**
   * INNER JOIN
   */
  join(
    table: string,
    firstColumn: string,
    operator: "=",
    secondColumn: string,
  ): this {
    this.joins.push(
      `JOIN ${quoteIdentifier(table)} ON ` +
        `${quoteIdentifier(firstColumn)} ${operator} ${quoteIdentifier(secondColumn)}`,
    );

    return this;
  }

  /**
   * LEFT JOIN
   */
  leftJoin(
    table: string,
    firstColumn: string,
    operator: "=",
    secondColumn: string,
  ): this {
    this.joins.push(
      `LEFT JOIN ${quoteIdentifier(table)} ON ` +
        `${quoteIdentifier(firstColumn)} ${operator} ${quoteIdentifier(secondColumn)}`,
    );

    return this;
  }

  /**
   * GROUP BY
   */
  groupBy(...columns: string[]): this {
    this.groupByColumns.push(
      ...columns.map((column) => quoteIdentifier(column)),
    );

    return this;
  }

  /**
   * ORDER BY
   */
  orderBy(column: string, direction: OrderDirection = "ASC"): this {
    this.orderByColumns.push(`${quoteIdentifier(column)} ${direction}`);

    return this;
  }

  /**
   * LIMIT
   */
  limit(value: number): this {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error("limit() must be a non-negative integer");
    }

    this.limitValue = value;

    return this;
  }

  /**
   * OFFSET
   */
  offset(value: number): this {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error("offset() must be a non-negative integer");
    }

    this.offsetValue = value;

    return this;
  }

  /**
   * Build WHERE SQL.
   */
  private buildWhere(): {
    sql: string;
    values: QueryValue[];
  } {
    if (this.conditions.length === 0) {
      return {
        sql: "",
        values: [],
      };
    }

    return {
      sql:
        " WHERE " +
        this.conditions.map((condition) => condition.sql).join(" AND "),
      values: this.conditions.flatMap((condition) => condition.values),
    };
  }

  /**
   * Build SELECT query.
   */
  private buildSelectQuery(): {
    sql: string;
    values: QueryValue[];
  } {
    const where = this.buildWhere();

    let sql = `
      SELECT ${this.selectedColumns.join(", ")}
      FROM ${quoteIdentifier(this.table)}
    `;

    if (this.joins.length > 0) {
      sql += ` ${this.joins.join(" ")}`;
    }

    sql += where.sql;

    if (this.groupByColumns.length > 0) {
      sql += ` GROUP BY ${this.groupByColumns.join(", ")}`;
    }

    if (this.orderByColumns.length > 0) {
      sql += ` ORDER BY ${this.orderByColumns.join(", ")}`;
    }

    if (this.limitValue !== undefined) {
      sql += ` LIMIT ${this.limitValue}`;
    }

    if (this.offsetValue !== undefined) {
      sql += ` OFFSET ${this.offsetValue}`;
    }

    return {
      sql,
      values: where.values,
    };
  }

  /**
   * Execute SELECT.
   */
  async get(): Promise<T[]> {
    const { sql, values } = this.buildSelectQuery();

    if (this.debugEnabled) logQuery(sql, values, this.database);

    const [rows] = await getMySqlPool(this.database).query<T[]>(sql, values);

    return rows;
  }

  /**
   * Execute SELECT and return first row.
   */
  async first(): Promise<T | null> {
    this.limitValue = 1;

    const rows = await this.get();

    return rows[0] ?? null;
  }

  /**
   * COUNT(*)
   */
  async count(): Promise<number> {
    const where = this.buildWhere();

    let sql = `
      SELECT COUNT(*) AS count
      FROM ${quoteIdentifier(this.table)}
    `;

    if (this.joins.length > 0) {
      sql += ` ${this.joins.join(" ")}`;
    }

    sql += where.sql;

    if (this.debugEnabled) logQuery(sql, where.values, this.database);

    const [rows] = await getMySqlPool(this.database).query<
      (RowDataPacket & { count: number })[]
    >(sql, where.values);

    return Number(rows[0]?.count ?? 0);
  }

  /**
   * INSERT
   *
   * .insert({
   *   name: "John",
   *   email: "john@example.com"
   * })
   */
  async insert(data: Record<string, QueryValue>): Promise<number> {
    const columns = Object.keys(data);

    if (columns.length === 0) {
      throw new Error("insert() requires at least one field");
    }

    const values = Object.values(data);

    const sql = `
      INSERT INTO ${quoteIdentifier(this.table)}
      (${columns.map(quoteIdentifier).join(", ")})
      VALUES (${columns.map(() => "?").join(", ")})
    `;

    if (this.debugEnabled) logQuery(sql, values, this.database);

    const [result] = await getMySqlPool(this.database).execute<ResultSetHeader>(
      sql,
      values,
    );

    return result.insertId;
  }

  /**
   * UPDATE
   */
  async update(data: Record<string, QueryValue>): Promise<number> {
    const columns = Object.keys(data);

    if (columns.length === 0) {
      throw new Error("update() requires at least one field");
    }

    if (this.conditions.length === 0) {
      throw new Error("Refusing to update without a WHERE condition");
    }

    const setSql = columns
      .map((column) => `${quoteIdentifier(column)} = ?`)
      .join(", ");

    const where = this.buildWhere();

    const sql = `
      UPDATE ${quoteIdentifier(this.table)}
      SET ${setSql}
      ${where.sql}
    `;

    const values = [...Object.values(data), ...where.values];

    if (this.debugEnabled) logQuery(sql, values, this.database);

    const [result] = await getMySqlPool(this.database).execute<ResultSetHeader>(
      sql,
      values,
    );

    return result.affectedRows;
  }

  /**
   * DELETE
   */
  async delete(): Promise<number> {
    if (this.conditions.length === 0) {
      throw new Error("Refusing to delete without a WHERE condition");
    }

    const where = this.buildWhere();

    const sql = `
      DELETE FROM ${quoteIdentifier(this.table)}
      ${where.sql}
    `;

    if (this.debugEnabled) logQuery(sql, where.values, this.database);

    const [result] = await getMySqlPool(this.database).execute<ResultSetHeader>(
      sql,
      where.values,
    );

    return result.affectedRows;
  }
}

/**
 * Entry point.
 *
 * db("users")
 * db("orders")
 * db("products")
 */
export function db<T extends RowDataPacket = RowDataPacket>(
  table: string,
  database: DatabaseKey = "primary",
): QueryBuilder<T> {
  return new QueryBuilder<T>(table, database);
}
