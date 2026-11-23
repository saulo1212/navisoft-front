import BackgroundAnimation from '@/components/BackgroundAnimation';
import autoscaleLogo from '@/assets/img/autoscale-light.png';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
const AuthLayout = ({
  children
}) => {
  return <>
      <nav className="navbar navbar-expand-lg navbar-dark position-fixed w-100 py-3" style={{
      zIndex: 1000
    }}>
        <Container>
          <Link className="navbar-brand" href="/">
            <Image className="autoscale-logo" src={autoscaleLogo} alt="Autoscale" unoptimized />
          </Link>
          <div className="ms-auto d-flex gap-2">
            <Link href="/auth/login" className="btn btn-link text-white border-0 text-decoration-none">
              Login
            </Link>
          </div>
        </Container>
      </nav>

      <section className="hero-section position-relative overflow-hidden">
        <Container style={{
        position: 'relative',
        zIndex: 1
      }}>{children}</Container>
        <BackgroundAnimation />
      </section>
    </>;
};
export default AuthLayout;
