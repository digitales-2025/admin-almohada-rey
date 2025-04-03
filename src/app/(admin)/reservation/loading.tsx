import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { METADATA } from "./_statics/metadata";

export default function Loading() {
  return (
    <div>
      <HeaderPage title={METADATA.title} description={METADATA.description} />
      <DataTableSkeleton columns={5} rows={10} />
    </div>
  );
}
