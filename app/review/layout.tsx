import AppHeader from "@/components/AppHeader";

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
