import { Badge } from "../ui/badge";
import { TitleSecction } from "./TitleSecction";

interface HeaderPageProps {
  title: string;
  description?: string;
  badgeContent?: string;
}

export const HeaderPage = ({ title, description, badgeContent }: HeaderPageProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-start justify-between">
        <div>
          <TitleSecction text={title} />
          <span className="text-sm text-slate-600 dark:text-white mt-1 block">{description}</span>
        </div>
        {badgeContent && (
          <Badge
            className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary dark:bg-primary/20 border border-primary/20"
            variant="secondary"
          >
            {badgeContent}
          </Badge>
        )}
      </div>
    </div>
  );
};
