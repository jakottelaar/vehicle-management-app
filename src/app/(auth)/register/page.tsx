"use client";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await register(email, password);
      console.log(res);
      setEmail("");
      setPassword("");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white">
      <form
        className="flex w-[300px] flex-col lg:w-[400px] space-y-4"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-6 text-center text-4xl font-semibold">Register</h1>
        <input
          type="text"
          placeholder="email"
          className="mb-4 rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 hover:border-neutral-50"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="mb-4 rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 hover:border-neutral-50"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="rounded-md border bg-white p-2 font-semibold text-neutral-950 duration-300 hover:border-white hover:bg-transparent hover:text-white"
          type="submit"
        >
          Register
        </button>
        <a href="/login" className="hover:underline w-fit">
          Already have an account?
        </a>
      </form>
    </div>
  );
};

export default Register;
