import { useState } from "react";
import { AutoSizeInput } from "../../utils/input-suit-auto-size";

export default function HomePage() {
  const [value, setValue] = useState<string>();

  console.log("render");

  return (
    <div>
      <AutoSizeInput value={value} onChange={e => setValue(e.target.value)} />
    </div>
  );
}
