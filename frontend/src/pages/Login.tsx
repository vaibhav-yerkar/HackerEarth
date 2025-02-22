import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Key } from "lucide-react";
import { useAppStore } from "../store/index";
import ApiService from "../services/api";
import { StudentProfile } from "../types";
import { format } from "date-fns";
import { DatePicker } from "../components/DatePicker";

type UserType = "parent" | "teacher";

interface LoginFormData {
  parent: {
    phone: string;
    dob: string;
  };
  teacher: {
    username: string;
    password: string;
  };
}

function Login() {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const [userType, setUserType] = useState<UserType>("parent");
  const [formData, setFormData] = useState<LoginFormData>({
    parent: { phone: "", dob: "" },
    teacher: { username: "", password: "" },
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for cache hits to update UI accordingly
    const handleCacheHit = (event: CustomEvent<{ key: string; data: any }>) => {
      if (event.detail.key === "GET_/get_students_profile") {
        // Update UI with cached data
        const cachedData = event.detail.data;
        setUser({
          id: cachedData.student_id,
          role: "parent",
          name: cachedData.guardian_name,
          email: cachedData.guardian_mail,
        });
      }
    };

    window.addEventListener("api-cache-hit", handleCacheHit as EventListener);
    return () => {
      window.removeEventListener(
        "api-cache-hit",
        handleCacheHit as EventListener
      );
    };
  }, [setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (userType === "parent") {
        const formattedDob = new Date(formData.parent.dob)
          .toISOString()
          .split("T")[0];

        // The request will automatically handle cache
        const response = await ApiService.get<StudentProfile>(
          "/get_students_profile",
          {
            params: {
              guardian_mob: formData.parent.phone,
              dob: formattedDob,
            },
          }
        );

        localStorage.setItem("student_id", response.student_id);
        setUser({
          id: response.student_id,
          role: "parent",
          name: response.guardian_name,
          email: response.guardian_mail,
        });
      } else {
        // Teacher login
        if (
          formData.teacher.username !== "admin" &&
          formData.teacher.password !== "admin"
        ) {
          throw new Error("Invalid credentials");
        }
        const res = await ApiService.get<StudentProfile[]>("/get_all_students");
        const response = res.Students;

        if (response.length > 0) {
          setUser({
            id: formData.teacher.username,
            role: "teacher",
            name: response[0].class_teacher,
            email: "teacher@example.com",
          });
        } else {
          throw new Error("No data returned for teacher");
        }
      }

      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [userType]: {
        ...prev[userType],
        [name]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Book className="mx-auto h-12 w-12 text-indigo-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to YetAnotherERP
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to continue
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setUserType("parent")}
              className={`px-4 py-2 rounded-md ${
                userType === "parent"
                  ? "bg-indigo-400 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Login as Parent
            </button>
            <button
              onClick={() => setUserType("teacher")}
              className={`px-4 py-2 rounded-md ${
                userType === "teacher"
                  ? "bg-indigo-400 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Login as Teacher
            </button>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              {userType === "parent" ? (
                <>
                  <div className="mb-4">
                    <label htmlFor="phone" className="sr-only">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Phone Number"
                      value={formData.parent.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student's Date of Birth
                    </label>
                    <DatePicker
                      value={
                        formData.parent.dob
                          ? new Date(formData.parent.dob)
                          : new Date()
                      }
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          parent: {
                            ...prev.parent,
                            dob: format(date, "yyyy-MM-dd"),
                          },
                        }))
                      }
                      maxDate={new Date()}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label htmlFor="username" className="sr-only">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Username"
                      value={formData.teacher.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={formData.teacher.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-400 
                  ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-indigo-500"
                  } 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Key className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />
                </span>
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
