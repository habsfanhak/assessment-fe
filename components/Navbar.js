import { Navbar, Nav } from "react-bootstrap";
import { Container } from "react-bootstrap";

import Link from "next/link";

export default function TaskNavbar() {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Nav>
                        <Link href="/" passHref legacyBehavior><Nav.Link className="px-4">Home</Nav.Link></Link>
                        <Link href="/add" passHref legacyBehavior><Nav.Link className="px-4">Add Task</Nav.Link></Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}