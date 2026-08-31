import { Suspense } from "react";

type PrivateLayoutProps = {
  children: React.ReactNode;
};

export const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <>
      <header></header>
      <main>
        <Suspense fallback={<div>Loading...</div>}> {children} </Suspense>
      </main>
      <footer></footer>
    </>
  );
};
