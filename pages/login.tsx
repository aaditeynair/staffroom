import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex items-center justify-center flex-col w-full h-full">
      <h1 className="text-4xl pb-8">LOGIN</h1>
      <form className="grid gap-4">
        <input
          className="bg-white p-2 border border-gray-400"
          placeholder="Email"
          type="text"
          value={email}
          onChange={(e) => {
            e.preventDefault();
            setEmail(e.currentTarget.value);
          }}
        />
        <input
          placeholder="Password"
          type="text"
          className="bg-white p-2 border border-gray-400"
          value={password}
          onChange={(e) => {
            e.preventDefault();
            setPassword(e.currentTarget.value);
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log(email, password);
          }}
          className="bg-blue-700 self-center text-white py-4"
        >
          LOGIN
        </button>
      </form>
    </div>
  );
}
