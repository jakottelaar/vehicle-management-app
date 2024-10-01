"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white">
      <form
        className="flex w-[300px] flex-col lg:w-[400px] space-y-4"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-6  text-center text-4xl font-semibold">Log in</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="mb-4 rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 hover:border-neutral-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 hover:border-neutral-50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="rounded-md border bg-white p-2 font-semibold text-neutral-950 duration-300 hover:border-white hover:bg-transparent hover:text-white"
          type="submit"
        >
          Login
        </button>
        <a href="/register" className="hover:underline w-fit">
          No account yet?
        </a>
      </form>
    </div>
  );
};

export default Login;
