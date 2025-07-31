"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePayments } from "../../_hooks/use-payments";
import PaymentManagement from "./_components/PaymentManagement";
import PaymentManagementSkeleton from "./_components/skeleton/PaymentManagementSkeleton";

export default function UpdatePaymentPage() {
  const { id } = useParams();

  const { paymentById, isLoadingPaymentById } = usePayments({
    id: id as string,
  });

  if (isLoadingPaymentById) {
    return (
      <div>
        <HeaderPage
          title="Gestión de Pago"
          description="Administre los detalles del pago y la información de reserva"
        />
        <PaymentManagementSkeleton />
      </div>
    );
  }

  if (!paymentById) {
    return (
      <div>
        <HeaderPage
          title="Gestión de Pago"
          description="Administre los detalles del pago y la información de reserva"
        />
        <ErrorGeneral />
      </div>
    );
  }
  return (
    <div>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/payments">Pagos</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href="/payments">Gestión de Pago</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">{paymentById.code}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <HeaderPage
        title="Gestión de Pago"
        description="Administre los detalles del pago y la información de reserva"
        badgeContent={paymentById.code}
      />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <PaymentManagement paymentById={paymentById} />
      </div>
    </div>
  );
}
