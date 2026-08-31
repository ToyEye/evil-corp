import { Suspense } from "react";
import { PublicHeader } from "../PublicHeader/PublicHeader";

type PublicLayoutProps = {
  children: React.ReactNode;
};

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <>
      <PublicHeader />
      <main>
        <Suspense fallback={<div>Loading...</div>}> {children} </Suspense>
      </main>
      <footer></footer>
    </>
  );
};
