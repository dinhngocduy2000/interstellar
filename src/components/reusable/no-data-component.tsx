import NoDataIcon from "@/assets/svgs/no-data-icon";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
interface Props extends PropsWithChildren {
  text?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}
const NoDataComponent = ({ text, props, children }: Props) => {
  return (
    <div
      {...props}
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2",
        props?.className,
      )}
    >
      <NoDataIcon />
      <p className="font-semibold text-gray-400">{text ?? "No Data"}</p>
      {children}
    </div>
  );
};

export default NoDataComponent;
