type TailwindHelperProps = {
  children: React.ReactNode;
};

const TailwindHelper = ({ children }: TailwindHelperProps) => {
  return <div className="bg-red-400 bg-blue-400 bg-purple-400"></div>;
};

export default TailwindHelper;
