import { PropsWithChildren, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Props extends PropsWithChildren {
  content?: string | ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
}

const AppTooltipComponent = ({
  children,
  content,
  triggerClassName,
  contentClassName,
}: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className={triggerClassName}>
          {children}
        </TooltipTrigger>
        <TooltipContent className={contentClassName}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AppTooltipComponent;
