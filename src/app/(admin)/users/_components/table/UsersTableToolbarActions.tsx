"use client";

import { type Table } from "@tanstack/react-table";

import { User } from "../../_types/user";
import { CreateUsersDialog } from "../create/CreateUserDialog";

export interface UsersTableToolbarActionsProps {
  table?: Table<User>;
}

export function UsersTableToolbarActions({ table }: UsersTableToolbarActionsProps) {
  console.log(table);
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <CreateUsersDialog />
    </div>
  );
}
