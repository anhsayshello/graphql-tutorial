import axios from "axios";
import classNames from "classnames";
import { useEffect, useRef, useState, useCallback } from "react";

interface Person {
  name: string;
  phone: string;
  id: string;
}

const URL = "http://localhost:3001/api/persons";

const App = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [personId, setPersonId] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  const fetchPersons = useCallback(async () => {
    try {
      const res = await axios.get(URL);
      console.log(res);
      setPersons(res.data);
    } catch (error) {
      console.error("Error fetching persons:", error);
      alert("Không thể tải danh sách người dùng");
    }
  }, []);

  const fetchInfo = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/persons/info");
      setInfo(res.data);
    } catch (error) {
      console.error("Error fetching info:", error);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchPersons(), fetchInfo()]);
  }, [fetchPersons, fetchInfo]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPhone(e.target.value);
  };

  const resetForm = () => {
    setNewName("");
    setNewPhone("");
    setIsChanging(false);
    setPersonId("");
  };

  const validateInput = (): boolean => {
    if (!newName.trim()) {
      alert("Vui lòng nhập tên");
      nameRef.current?.focus();
      return false;
    }
    if (!newPhone.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return false;
    }
    return true;
  };

  const addPerson = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    setLoading(true);

    try {
      if (isChanging) {
        await axios.put(`${URL}/${personId}`, {
          name: newName.trim(),
          phone: newPhone.trim(),
        });
        alert("Cập nhật thành công!");
      } else {
        await axios.post(URL, {
          name: newName.trim(),
          phone: newPhone.trim(),
        });
        alert("Thêm người dùng thành công!");
      }

      await refreshData();
      resetForm();
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.error || "Có lỗi xảy ra";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const changePerson = (person: Person) => {
    setPersonId(person.id);
    setIsChanging(true);
    setNewName(person.name);
    setNewPhone(person.phone);
    nameRef.current?.focus();
  };

  const deletePerson = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa ${name}?`)) return;

    try {
      await axios.delete(`${URL}/${id}`);
      alert("Xóa người dùng thành công!");

      // Optimistic update
      setPersons((prev) => prev.filter((person) => person.id !== id));

      if (id === personId) {
        resetForm();
      }

      await fetchInfo(); // Chỉ cần update info
    } catch (error: any) {
      console.error("Error:", error);
      alert("Xóa người dùng thất bại!");
      // Refresh data để đảm bảo state đúng
      await refreshData();
    }
  };

  const goToPerson = async (id: string) => {
    try {
      const res = await axios.get(`${URL}/${id}`);
      console.log("Person details:", res.data);
    } catch (error) {
      console.error("Error fetching person:", error);
      alert("Không thể tải thông tin người dùng");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div
        className="my-4 text-sm text-gray-700 bg-gray-50 p-3 rounded"
        dangerouslySetInnerHTML={{ __html: info }}
      />

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
                value={newName}
                onChange={handleNameChange}
                placeholder="Nhập tên..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại:
              </label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPhone}
                onChange={handlePhoneChange}
                placeholder="Nhập số điện thoại..."
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                className={classNames(
                  "px-4 py-2 rounded font-medium transition-colors",
                  {
                    "bg-blue-500 text-white hover:bg-blue-600": !loading,
                    "bg-gray-300 text-gray-500 cursor-not-allowed": loading,
                  }
                )}
                type="submit"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : isChanging ? "Cập nhật" : "Thêm"}
              </button>

              {isChanging && (
                <button
                  type="button"
                  className="px-3 py-2 border rounded hover:bg-gray-50 transition-colors"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>

          <h2 className="text-2xl font-bold mb-4">Danh sách</h2>

          {persons.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Chưa có người dùng nào
            </p>
          ) : (
            <ul className="space-y-2 h-100 overflow-y-scroll">
              {persons.map((person) => (
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
                  <button
                    onClick={() => goToPerson(person.id)}
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {person.name}
                  </button>

                  <span className="text-gray-600 flex-1">{person.phone}</span>

                  <button
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 transition-colors"
                    onClick={() => changePerson(person)}
                  >
                    Sửa
                  </button>

                  <button
                    className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                    onClick={() => deletePerson(person.id, person.name)}
                  >
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
