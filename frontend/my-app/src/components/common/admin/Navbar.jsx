import { useAuth } from "../../context/AuthContext";

const Navbar = () => {

  const { user } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold">
        Hospital Management System
      </h1>

      <div className="text-right">

        <p className="font-semibold">
          {user?.full_name}
        </p>

        <p className="text-sm text-gray-500">
          Administrator
        </p>

      </div>

    </header>
  );
};

export default Navbar;