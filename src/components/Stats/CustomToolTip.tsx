import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border bg-[#f0f4f7] px-3 py-2 shadow">
        <p className="text-slate-900">{new Date(label).toLocaleDateString()}</p>
        {payload.map((entry) =>
          entry.value !== 0 ? (
            <p
              key={`${entry.dataKey}+${Math.random()}`}
              className="text-sm text-slate-800"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
            </p>
          ) : null,
        )}
      </div>
    );
  }
  return null;
};
