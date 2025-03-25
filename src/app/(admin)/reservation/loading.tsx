import { HeaderPage } from "@/components/common/HeaderPage";
import { TableSkeleton } from "@/components/datatable/data-table-skeleton";
import { Card } from "@/components/ui/card";
import { METADATA } from "./_statics/metadata";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <HeaderPage title={METADATA.title} description={METADATA.description} />
      <div className="flex flex-col items-end justify-center gap-4">
        <Card>
          <TableSkeleton columns={5} rows={10} />
        </Card>
      </div>
    </div>
  );
}
