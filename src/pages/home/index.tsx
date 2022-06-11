import { useEffect } from "react";
import { sysAttachmentApi } from "../../api/sys-attachment-api";

export default function HomePage() {
  useEffect(() => {
    sysAttachmentApi.listAttachment("test", 1)
      .then((d) => {
        console.log(d);
      });
  });

  return <div>home page</div>
}
