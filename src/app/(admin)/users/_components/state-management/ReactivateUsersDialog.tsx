import { ComponentPropsWithoutRef } from "react";
import { Row } from "@tanstack/react-table";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useUsers } from "../../_hooks/use-users";
import { User } from "../../_types/user";

interface ReactivateUsersDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  users: Row<User>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export const ReactivateUsersDialog = ({
  users,
  showTrigger = true,
  onSuccess,
  ...props
}: ReactivateUsersDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onReactivateUsers, isLoadingReactivateUsers } = useUsers();

  const onReactivateUsersHandler = () => {
    onReactivateUsers(users);
    props.onOpenChange?.(false);
    onSuccess?.();
  };

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        {showTrigger ? (
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
              Reactivar ({users.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción reactivará a <span className="font-medium"> {users.length}</span>
              {users.length === 1 ? " usuario" : " usuarios"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Reactivate selected rows"
              onClick={onReactivateUsersHandler}
              disabled={isLoadingReactivateUsers}
            >
              {isLoadingReactivateUsers && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Reactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
            Reactivar ({users.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción reactivará a<span className="font-medium">{users.length}</span>
            {users.length === 1 ? " usuario" : " usuarios"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button
            aria-label="Reactivate selected rows"
            onClick={onReactivateUsersHandler}
            disabled={isLoadingReactivateUsers}
          >
            {isLoadingReactivateUsers && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Reactivar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
