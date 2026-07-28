import "./scalar.css";
import { useEffect } from "react";

export function ApiDocsPage() {
  useEffect(() => {
    document.body.classList.add("api-docs-body");
    return () => document.body.classList.remove("api-docs-body");
  }, []);

  return <main data-api-docs>API reference</main>;
}
