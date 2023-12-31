import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaUserGraduate } from 'react-icons/fa';

function ModalRight({ children, ...props  }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <button className="button me-2" size='sm' onClick={handleShow}>
                {props.name}
            </button>
            <Offcanvas show={show} onHide={handleClose} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title><FaUserGraduate/> Cadastrar Aluno</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {children}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}


export default ModalRight;