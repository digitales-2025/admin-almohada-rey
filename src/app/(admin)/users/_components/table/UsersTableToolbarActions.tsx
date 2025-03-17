"use client";

import { type Table } from "@tanstack/react-table";

import { User } from "../../_types/user";

export interface UsersTableToolbarActionsProps {
  table?: Table<User>;
}

export function UsersTableToolbarActions({ table }: UsersTableToolbarActionsProps) {
  console.log(table);
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button className="btn btn-danger">
        <span className="hidden sm:inline">Eliminar</span>
        <span className="sm:hidden">❌</span>
      </button>
    </div>
  );
}
