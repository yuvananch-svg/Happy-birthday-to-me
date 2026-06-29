import { registerPath } from "@/lib/auth/paths";
import { isStaticExportMode } from "@/lib/auth/static-mode";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  if (!isStaticExportMode()) {
    return children;
  }

  const target = registerPath();

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `if(localStorage.getItem("anniversary_access")!=="granted"){window.location.replace(${JSON.stringify(target)});}`
        }}
      />
      {children}
    </>
  );
}
