import Image from "next/image";
import logoLight from "@/assets/img/logo-light.svg";
import Link from "next/link";
const Header = () => {
  return <nav className="navbar navbar-expand-lg navbar-dark fixed-top w-100 py-3">
            <div className="container">
                <Link className="navbar-brand" href="/">
                    <Image src={logoLight} alt="logo" />
                </Link>

                <div className="ms-auto d-flex gap-2">
                    <Link href="/auth/login" className="btn btn-link text-white border-0 text-decoration-none">Login</Link>
                    <Link href="/auth/register" className="btn btn-link text-white border-0 text-decoration-none">Register</Link>
                </div>
            </div>
        </nav>;
};
export default Header;