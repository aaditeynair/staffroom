import pageAuth from "@/components/auth/pageAuth";
import LogoutButton from "@/components/auth/logout";

function Home() {
  return (
    <div>
      <p>Home</p>
      <LogoutButton></LogoutButton>
    </div>
  );
}

export default pageAuth(Home);

