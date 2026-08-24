import type { CSSProperties, ReactNode } from "react";

/**
 * Device bezel around a 390x844 screen.
 *
 * With no `scale`, the wrapper sizes itself from the `--ps` custom property so
 * the surrounding section can change the phone size responsively in CSS.
 */
export function Phone({
  children,
  scale,
  className = "",
  style,
}: {
  children?: ReactNode;
  scale?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const variable = scale === undefined;
  return (
    <div
      className={"ph-wrap " + (variable ? "ph-var " : "") + className}
      style={variable ? style : { width: 410 * scale, height: 864 * scale, ...style }}
    >
      <div className="ph" style={variable ? undefined : { transform: `scale(${scale})` }}>
        <div className="ph-screen">{children}</div>
        <div className="ph-island" />
      </div>
    </div>
  );
}
