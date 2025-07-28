import classNames from "classnames";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ALL_PERSONS, FIND_PERSON } from "./graphql/queries/person";
import { CREATE_PERSON } from "./graphql/mutations/createPerson";

interface Person {
  name: string;
  phone?: string;
  id: string;
  address: {
    street: string;
    city: string;
  };
}

const App = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");

  const [isChanging, setIsChanging] = useState(false);
  const [personId, setPersonId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nameToSearch, setNameToSearch] = useState("");

  // query
  const { data: dataAllPersons, loading: dataAllPersonsLoading } =
    useQuery(ALL_PERSONS);
  console.log("data: ", dataAllPersons);
  const allPersons: Person[] = dataAllPersons?.allPersons ?? [];

  const { data: dataPerson } = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  });
  console.log(dataPerson);
  const person: Person = dataPerson?.findPerson ?? [];

  // mutation
  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }],
    onError: (error) => {
      console.log(error);
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      setErrorMessage(messages);
    },
  });

  const nameRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName("");
    setPhone("");
    setStreet("");
    setCity("");
    setIsChanging(false);
    setPersonId("");
  };

  const validateInput = (): boolean => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên");
      nameRef.current?.focus();
      return false;
    }
    if (!phone.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!street.trim()) {
      alert("Vui lòng nhập tên street");
      nameRef.current?.focus();
      return false;
    }
    if (!city.trim()) {
      alert("Vui lòng nhập city");
      return false;
    }
    return true;
  };

  const addPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) return;

    if (isChanging) {
      alert("Cập nhật thành công!");
      resetForm();
    } else {
      const result = await createPerson({
        variables: { name, phone, street, city },
      });
      console.log(result);
      if (result.errors || !result.data) {
        console.error("Mutation errors:", result.errors);
        return;
      }
      alert("Thêm người dùng success!");
      resetForm();
    }
  };

  const changePerson = (person: Person) => {
    setPersonId(person.id);
    setIsChanging(true);
    setName(person.name);
    setPhone(person.phone as string);
    setStreet(person.address.street);
    setCity(person.address.city);
    nameRef.current?.focus();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-center items-center mt-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Phonebook</h2>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          <form onSubmit={addPerson} className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên:</label>
              <input
                ref={nameRef}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên..."
                disabled={dataAllPersonsLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại:
              </label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại..."
                disabled={dataAllPersonsLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Street:</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Nhập street..."
                disabled={dataAllPersonsLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City:</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Nhập city..."
                disabled={dataAllPersonsLoading}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                className={classNames(
                  "px-4 py-2 rounded font-medium transition-colors",
                  {
                    "bg-blue-500 text-white hover:bg-blue-600":
                      !dataAllPersonsLoading,
                    "bg-gray-300 text-gray-500 cursor-not-allowed":
                      dataAllPersonsLoading,
                  }
                )}
                type="submit"
                disabled={dataAllPersonsLoading}
              >
                {dataAllPersonsLoading
                  ? "Đang xử lý..."
                  : isChanging
                  ? "Cập nhật"
                  : "Thêm"}
              </button>

              {isChanging && (
                <button
                  type="button"
                  className="px-3 py-2 border rounded hover:bg-gray-50 transition-colors"
                  onClick={resetForm}
                  disabled={dataAllPersonsLoading}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
          <div className="my-4">
            <h2 className="text-2xl font-bold mb-4">Tìm kiếm</h2>
            <div className="flex items-center gap-8">
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="enter a name to search"
                value={nameToSearch}
                onChange={(e) => setNameToSearch(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <div
                key={person.id}
                className={classNames(
                  "flex items-center gap-4 p-3 rounded transition-colors",
                  {
                    "bg-blue-50 border border-blue-200": person.id === personId,
                    "bg-gray-50 hover:bg-gray-100": person.id !== personId,
                  }
                )}
              >
                <button className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  {person.name}
                </button>

                <span className="text-gray-600 flex-1">{person.phone}</span>

                <button
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 transition-colors"
                  onClick={() => changePerson(person)}
                >
                  Sửa
                </button>

                <button className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors">
                  Xóa
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Danh sách</h2>

          {allPersons.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Chưa có người dùng nào
            </p>
          ) : (
            <ul className="space-y-2 h-100 overflow-y-scroll">
              {allPersons.map((person) => (
                <li
                  key={person.id}
                  className={classNames(
                    "flex items-center gap-4 p-3 rounded transition-colors",
                    {
                      "bg-blue-50 border border-blue-200":
                        person.id === personId,
                      "bg-gray-50 hover:bg-gray-100": person.id !== personId,
                    }
                  )}
                >
                  <button className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    {person.name}
                  </button>

                  <span className="text-gray-600 flex-1">{person.phone}</span>

                  <button
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 transition-colors"
                    onClick={() => changePerson(person)}
                  >
                    Sửa
                  </button>

                  <button className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors">
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
