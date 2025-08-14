import type { PropsWithChildren } from "react";

export default function Monitor({ children }: PropsWithChildren) {
  return (
    <div className="monitor">
      <div className="status">
        <div className="led green" title="POWER" />
        <div className="led red" title="COMMS LINK" />
      </div>
      <div className="screws">
        <div className="screw tl" />
        <div className="screw tr" />
        <div className="screw bl" />
        <div className="screw br" />
      </div>
      {children}
    </div>
  );
}
