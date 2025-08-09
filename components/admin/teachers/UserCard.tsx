interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "admin-teacher";
}

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="rounded-md p-4 shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-lg">{user.name}</h3>
      <p className="text-gray-600 text-sm">{user.email}</p>
    </div>
  );
}
