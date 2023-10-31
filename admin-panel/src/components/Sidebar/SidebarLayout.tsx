import Sidebar from "./Sidebar";

const SidebarLayout: React.FC = ({ children }: any) => {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-grow bg-gray-200 p-10">{children}</div>
    </div>
  );
};

export default SidebarLayout;
