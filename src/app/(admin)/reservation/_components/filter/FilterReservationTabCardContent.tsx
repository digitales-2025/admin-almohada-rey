import React from "react";
import { TabsContent, type TabsContentProps } from "@radix-ui/react-tabs";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CustomsTabsContentProps = React.ForwardRefExoticComponent<TabsContentProps & React.RefAttributes<HTMLDivElement>>;
interface FilterStockTabCardContentProps extends CustomsTabsContentProps {
  title: string;
  description: string;
  value: string;
  children?: React.ReactNode;
}

export function FilterReservationTabCardContent({
  children,
  value,
  title,
  description,
  ...rest
}: Omit<FilterStockTabCardContentProps, "$$typeof" | "render" | "defaultProps">) {
  return (
    <TabsContent {...rest} value={value} className="min-h-[350px] h-[350px] max-h-[350px] overflow-y-auto">
      <Card className="w-full h-fit flex flex-col justify-center">
        <CardHeader className="space-y-4">
          <CardTitle className="block text-center">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">{children}</CardContent>
      </Card>
    </TabsContent>
  );
}
