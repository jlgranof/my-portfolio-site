import type { PropsWithChildren } from "react";

export default function Screen({ children }: PropsWithChildren) {
  return (
    <div className="screen">
      {children}
      <div className="glass" />
      <div className="noise" />
    </div>
  );
}
