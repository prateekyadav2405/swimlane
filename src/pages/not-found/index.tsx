import { Button } from "@/design-system/button";
import { useNavigate } from "react-router";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-full place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          There seems to be some error on this page. Contact support for help.
        </h1>
        <p className="text-base leading-7 text-secondary-foreground">
          We appologize for the inconvenience.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={() => navigate("/dashboard")}>Go back home</Button>
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;
