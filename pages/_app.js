import 'bootstrap/dist/css/bootstrap.min.css';
import TaskNavbar from '@/components/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <>
      <TaskNavbar/>
      <Component {...pageProps} />
    </>
  )
}
