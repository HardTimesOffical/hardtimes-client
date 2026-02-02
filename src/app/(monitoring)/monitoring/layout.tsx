export default function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="content-theme-wrapper">
      {/* Здесь может быть свой Sidebar или Header */}
      {children}
    </div>
  );
}